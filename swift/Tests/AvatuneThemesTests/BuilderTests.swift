#if canImport(CoreGraphics)

    import AvatuneAllThemes
    import AvatuneCore
    import AvatuneKyute
    import AvatuneRender
    import CoreGraphics
    import XCTest

    #if canImport(QuartzCore)
        import QuartzCore
    #endif

    /// Covers the generated builder and the layer, neither of which the parity
    /// suites touch — those go straight from a theme and a seed to pixels.
    final class BuilderTests: XCTestCase {
        private let size = 96.0

        private func pixels(of image: CGImage) -> [UInt8]? {
            var buffer = [UInt8](repeating: 0, count: image.width * image.height * 4)
            guard
                let context = CGContext(
                    data: &buffer,
                    width: image.width,
                    height: image.height,
                    bitsPerComponent: 8,
                    bytesPerRow: image.width * 4,
                    space: CGColorSpaceCreateDeviceRGB(),
                    bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
                )
            else { return nil }
            context.draw(image, in: CGRect(x: 0, y: 0, width: image.width, height: image.height))
            return buffer
        }

        /// The builder is sugar over `AvatarConfiguration`, so the two spellings
        /// have to resolve identically — otherwise the typed API quietly means
        /// something different from the documented one.
        func testBuilderMatchesRawConfiguration() {
            let built = KyuteAvatar(seed: "alice")
                .hair(.bob)
                .body(.tshirt)
                .headColor(.hex(0xF0C8A0))
                .background(.hex(0x202020))
                .resolved()

            var raw = AvatarConfiguration(seed: "alice")
            raw[.hair] = "bob"
            raw[.body] = "tshirt"
            raw[color: .head] = .hex(0xF0C8A0)
            raw.backgroundColor = .hex(0x202020)
            let manual = ResolvedAvatar(theme: .kyute, configuration: raw)

            XCTAssertEqual(built.identifiers, manual.identifiers)
            XCTAssertEqual(built.colors, manual.colors)
            XCTAssertEqual(built.backgroundColor, manual.backgroundColor)
        }

        /// Every method returns a copy, so a chain cannot mutate the value it was
        /// called on.
        func testBuilderIsValueSemantic() {
            let base = KyuteAvatar(seed: "alice")
            let withHair = base.hair(.ponyTail)

            XCTAssertNil(base.configuration[.hair])
            XCTAssertEqual(withHair.configuration[.hair], "ponyTail")
        }

        /// A pinned identifier has to actually win over what the seed would pick,
        /// for at least one item that differs.
        func testPinnedItemOverridesTheSeed() throws {
            let seeded = KyuteAvatar(seed: "alice").resolved()
            let alternatives = Kyute.Hair.allCases.map(\.rawValue)
            let different = try XCTUnwrap(
                alternatives.first { $0 != seeded.identifiers[.hair] },
                "kyute should offer more than one hair"
            )
            let pinned = KyuteAvatar(seed: "alice")
                .hair(try XCTUnwrap(Kyute.Hair(rawValue: different)))
                .resolved()

            XCTAssertEqual(pinned.identifiers[.hair], different)
            XCTAssertNotEqual(pinned.identifiers[.hair], seeded.identifiers[.hair])
        }

        /// Re-resolving an already-resolved avatar must not re-run selection and
        /// land somewhere else.
        func testResolvedAvatarIsIdempotent() {
            let once = KyuteAvatar(seed: "alice").hair(.bob).resolved()
            let twice = once.resolved()

            XCTAssertEqual(once.identifiers, twice.identifiers)
            XCTAssertEqual(once.colors, twice.colors)
            XCTAssertEqual(once.backgroundColor, twice.backgroundColor)
        }

        #if canImport(QuartzCore)
            /// The layer reads the context's transform to decide whether to flip,
            /// because UIKit, AppKit and `isGeometryFlipped` all disagree. Both
            /// orientations must produce the same picture.
            func testLayerDrawsTheSameInEitherOrientation() throws {
                let avatar = KyuteAvatar(seed: "orientation").resolved()
                let layer = AvatarLayer(avatar)
                layer.bounds = CGRect(x: 0, y: 0, width: size, height: size)

                func render(flipped: Bool) throws -> [UInt8] {
                    let context = try XCTUnwrap(
                        CGContext(
                            data: nil,
                            width: Int(size),
                            height: Int(size),
                            bitsPerComponent: 8,
                            bytesPerRow: 0,
                            space: CGColorSpaceCreateDeviceRGB(),
                            bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
                        )
                    )
                    if flipped {
                        context.translateBy(x: 0, y: CGFloat(size))
                        context.scaleBy(x: 1, y: -1)
                    }
                    layer.draw(in: context)
                    return try XCTUnwrap(context.makeImage().flatMap(pixels))
                }

                let bottomUp = try render(flipped: false)
                let topLeft = try render(flipped: true)
                XCTAssertEqual(
                    bottomUp, topLeft,
                    "the layer should compensate for the context's orientation"
                )

                // And it should agree with the renderer everything else uses.
                let reference = try XCTUnwrap(
                    AvatarImageRenderer.cgImage(avatar, size: size, scale: 1).flatMap(pixels))
                XCTAssertEqual(topLeft, reference)
            }
        #endif

        /// The platform image API is the one path the macOS parity suite cannot
        /// reach on iOS, so at minimum it has to produce a correctly sized image.
        func testPlatformImageRenders() throws {
            let avatar = KyuteAvatar(seed: "alice").resolved()

            #if canImport(UIKit)
                let image = try XCTUnwrap(AvatarImageRenderer.image(avatar, size: size, scale: 2))
                XCTAssertEqual(image.size.width, size, accuracy: 0.5)
                XCTAssertEqual(image.scale, 2, accuracy: 0.01)
                XCTAssertEqual(image.cgImage?.width, Int(size * 2))
            #elseif canImport(AppKit)
                let image = try XCTUnwrap(AvatarImageRenderer.image(avatar, size: size, scale: 2))
                XCTAssertEqual(image.size.width, size, accuracy: 0.5)
            #endif
        }
    }

#endif
