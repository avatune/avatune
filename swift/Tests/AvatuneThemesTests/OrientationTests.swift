#if canImport(CoreGraphics)

    import AvatuneAllThemes
    import AvatuneCore
    import AvatuneRender
    import CoreGraphics
    import XCTest

    /// Guards the coordinate-system contract of `draw(in:size:)`.
    ///
    /// This is half of a pair, and only meaningful as such. The visual-parity
    /// suite in `tests/swift` pins `AvatarImageRenderer` *absolutely*, by diffing
    /// against the PNG baselines the web renderer produced. What it cannot see is
    /// the other way a context reaches the renderer: a `Canvas` or a flipped
    /// `CALayer` hands over a context that already uses a top-left origin, and
    /// flipping again draws every avatar upside down.
    ///
    /// So this suite pins the already-flipped path *relative to* the image path.
    /// Neither test here can detect a flip that both paths share — that is the
    /// parity suite's job, and it does catch it.
    final class OrientationTests: XCTestCase {
        private let size = 96.0

        /// Draws into a context prepared the way SwiftUI's `Canvas` prepares one:
        /// already flipped, nothing else done to it.
        private func drawAsCanvasWould(_ avatar: ResolvedAvatar) -> [UInt8]? {
            guard
                let context = CGContext(
                    data: nil,
                    width: Int(size),
                    height: Int(size),
                    bitsPerComponent: 8,
                    bytesPerRow: 0,
                    space: CGColorSpaceCreateDeviceRGB(),
                    bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
                )
            else { return nil }

            context.translateBy(x: 0, y: CGFloat(size))
            context.scaleBy(x: 1, y: -1)
            avatar.draw(in: context, size: CGSize(width: size, height: size))

            return context.makeImage().flatMap(pixels)
        }

        private func pixels(of image: CGImage) -> [UInt8]? {
            let width = image.width
            let height = image.height
            var buffer = [UInt8](repeating: 0, count: width * height * 4)

            guard
                let context = CGContext(
                    data: &buffer,
                    width: width,
                    height: height,
                    bitsPerComponent: 8,
                    bytesPerRow: width * 4,
                    space: CGColorSpaceCreateDeviceRGB(),
                    bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
                )
            else { return nil }

            context.draw(image, in: CGRect(x: 0, y: 0, width: width, height: height))
            return buffer
        }

        /// Both entry points must agree. If one flips and the other does not, the
        /// two renders are mirrored and this fails.
        func testCanvasAndImageRendererAgree() throws {
            for (name, theme) in allThemes.sorted(by: { $0.key < $1.key }) {
                let avatar = ResolvedAvatar(theme: theme, seed: .string("orientation"))

                let viaCanvas = try XCTUnwrap(
                    drawAsCanvasWould(avatar), "\(name): canvas-style render failed")
                let viaRenderer = try XCTUnwrap(
                    AvatarImageRenderer.cgImage(avatar, size: size, scale: 1).flatMap(pixels),
                    "\(name): image render failed"
                )

                XCTAssertEqual(
                    viaCanvas, viaRenderer,
                    "\(name): a context that is already top-left origin renders differently "
                        + "from the image renderer, so one of them flips when it should not"
                )
            }
        }

        /// Precondition for the comparison above: an avatar has to be vertically
        /// asymmetric for a flip to show up as a difference at all. If a theme
        /// ever rendered symmetrically, the agreement test would pass regardless
        /// of orientation and this says so out loud.
        func testRenderIsVerticallyAsymmetric() throws {
            let theme = try XCTUnwrap(allThemes["kyute"])
            let avatar = ResolvedAvatar(theme: theme, seed: .string("orientation"))
            let rendered = try XCTUnwrap(
                AvatarImageRenderer.cgImage(avatar, size: size, scale: 1).flatMap(pixels))

            let side = Int(size)
            let stride = side * 4
            var mirrored = [UInt8](repeating: 0, count: rendered.count)
            for row in 0..<side {
                let source = row * stride
                let destination = (side - 1 - row) * stride
                for byte in 0..<stride {
                    mirrored[destination + byte] = rendered[source + byte]
                }
            }

            XCTAssertNotEqual(
                rendered, mirrored,
                "the avatar renders vertically symmetric, so a flip would be undetectable"
            )

            // The top of a portrait carries hair and the bottom a body, so the
            // halves differ substantially either way up.
            func meanLuminance(_ buffer: [UInt8], rows: Range<Int>) -> Double {
                var total = 0.0
                for row in rows {
                    for column in 0..<side {
                        let offset = row * stride + column * 4
                        total += Double(buffer[offset]) + Double(buffer[offset + 1])
                            + Double(buffer[offset + 2])
                    }
                }
                return total / Double(rows.count * side * 3)
            }

            let top = meanLuminance(rendered, rows: 0..<(side / 4))
            let bottom = meanLuminance(rendered, rows: (side * 3 / 4)..<side)
            XCTAssertNotEqual(top, bottom, accuracy: 0.5)
        }
    }

#endif
