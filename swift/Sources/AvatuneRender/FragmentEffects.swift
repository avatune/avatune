#if canImport(CoreGraphics)

    import AvatuneCore
    import CoreGraphics
    import Foundation
    import SwiftDraw

    #if canImport(CoreImage)
        import CoreImage
    #endif

    extension CGContext {
        /// Draws a fragment with the effects its SVG could not express.
        ///
        /// Blend modes and filters are stripped from the artwork at generation
        /// time because the SVG engine implements neither, so they are reapplied
        /// here with the platform's own compositing.
        ///
        /// A fragment carrying an effect is rendered to an offscreen image first
        /// and that image is composited. Setting the blend mode on the context and
        /// letting the SVG engine draw into it does not work — the engine manages
        /// its own graphics state and the mode never reaches the drawing
        /// operations, which shows up as a blend that silently does nothing.
        /// Compositing an image is also the only way to blur, so all three effects
        /// share one path.
        func draw(_ svg: SVG, effects: [FragmentEffect], in rect: CGRect) {
            guard !effects.isEmpty else {
                draw(svg, in: rect)
                return
            }

            var blend = CGBlendMode.normal
            var shadow: (offset: CGSize, blur: Double, color: AvatuneColor)?
            var blur = 0.0

            for effect in effects {
                switch effect {
                case .blend(let mode):
                    blend = mode.cgBlendMode
                case .dropShadow(let dx, let dy, let stdDeviation, let color):
                    shadow = (
                        // The context is flipped to SVG's top-left origin, so a
                        // positive dy has to be negated to fall downwards.
                        offset: CGSize(width: dx, height: -dy),
                        // Core Graphics takes a blur radius where SVG gives a
                        // Gaussian standard deviation.
                        blur: stdDeviation * 2,
                        color: color
                    )
                case .blur(let stdDeviation):
                    blur = stdDeviation
                }
            }

            // Room for whatever the effects spread beyond the fragment's bounds.
            let spread = max(
                blur * 3,
                shadow.map { $0.blur * 2 + max(abs($0.offset.width), abs($0.offset.height)) } ?? 0
            )
            let padded = rect.insetBy(dx: -spread, dy: -spread)

            guard var image = render(svg, in: rect, padded: padded) else {
                draw(svg, in: rect)
                return
            }
            if blur > 0 {
                guard let blurred = image.blurred(stdDeviation: blur * renderScale) else {
                    draw(svg, in: rect)
                    return
                }
                image = blurred
            }

            saveGState()
            if let shadow {
                setShadow(
                    offset: shadow.offset,
                    blur: CGFloat(shadow.blur),
                    color: shadow.color.cgColor
                )
            }
            setBlendMode(blend)

            // The offscreen is in SVG's top-left orientation; the destination
            // context is flipped, so it is turned back over before compositing.
            translateBy(x: padded.minX, y: padded.maxY)
            scaleBy(x: 1, y: -1)
            draw(image, in: CGRect(origin: .zero, size: padded.size))
            restoreGState()
        }

        /// Pixels per point currently in effect, so offscreens match the
        /// destination's resolution rather than being drawn at 1x and upscaled.
        private var renderScale: Double {
            let transform = ctm
            return max(1, (transform.a * transform.a + transform.b * transform.b).squareRoot())
        }

        /// Renders a fragment alone into a transparent bitmap.
        private func render(_ svg: SVG, in rect: CGRect, padded: CGRect) -> CGImage? {
            let scale = renderScale
            let width = Int((padded.width * scale).rounded(.up))
            let height = Int((padded.height * scale).rounded(.up))
            guard width > 0, height > 0 else { return nil }

            guard
                let offscreen = CGContext(
                    data: nil,
                    width: width,
                    height: height,
                    bitsPerComponent: 8,
                    bytesPerRow: 0,
                    space: CGColorSpaceCreateDeviceRGB(),
                    bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
                )
            else { return nil }

            // Flipped to match the destination context. Without this the SVG
            // renders into a bottom-up bitmap and the composited fragment comes
            // out mirrored — which looks like the effect itself is broken.
            offscreen.translateBy(x: 0, y: CGFloat(height))
            offscreen.scaleBy(x: 1, y: -1)
            offscreen.scaleBy(x: CGFloat(scale), y: CGFloat(scale))

            offscreen.draw(
                svg,
                in: CGRect(
                    x: rect.minX - padded.minX,
                    y: rect.minY - padded.minY,
                    width: rect.width,
                    height: rect.height
                )
            )
            return offscreen.makeImage()
        }
    }

    extension BlendMode {
        var cgBlendMode: CGBlendMode {
            switch self {
            case .multiply: return .multiply
            case .screen: return .screen
            }
        }
    }

    extension CGImage {
        /// Gaussian blur matching the SVG filter's standard deviation.
        func blurred(stdDeviation: Double) -> CGImage? {
            #if canImport(CoreImage)
                let input = CIImage(cgImage: self)
                guard
                    let filter = CIFilter(
                        name: "CIGaussianBlur",
                        parameters: [
                            kCIInputImageKey: input,
                            kCIInputRadiusKey: stdDeviation,
                        ]
                    ),
                    let output = filter.outputImage
                else { return nil }

                // Cropped back to the input extent: a Gaussian blur grows the
                // image, and the caller already reserved padding for the spread.
                return CIContext(options: nil).createCGImage(output, from: input.extent)
            #else
                return nil
            #endif
        }
    }

#endif
