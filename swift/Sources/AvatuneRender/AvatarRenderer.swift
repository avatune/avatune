#if canImport(CoreGraphics)

    import AvatuneCore
    import CoreGraphics
    import Foundation
    import SwiftDraw

    extension ResolvedAvatar {
        /// Draws the avatar into a context, filling a square of `size` points.
        ///
        /// **The context must use a top-left origin**, with y increasing
        /// downwards. That is what SwiftUI's `Canvas`, UIKit's
        /// `UIGraphicsImageRenderer` and a `CALayer` with flipped geometry all
        /// provide, and it is the coordinate system SVG itself is written in.
        /// A raw `CGContext` is bottom-up and has to be flipped first, which is
        /// what `AvatarImageRenderer` does; flipping here instead would draw
        /// upside down everywhere the context was already correct.
        ///
        /// Items are drawn one at a time rather than as a single composed
        /// document, which is what lets each one be parsed once and reused: the
        /// composed form differs for every avatar, while an individual item recurs
        /// constantly.
        public func draw(in context: CGContext, size: CGSize) {
            let side = min(size.width, size.height)
            guard side > 0 else { return }

            context.saveGState()
            defer { context.restoreGState() }

            let bounds = CGRect(x: 0, y: 0, width: side, height: side)
            let radius = cornerRadius(for: Double(side))
            let clip = CGPath(
                roundedRect: bounds,
                cornerWidth: CGFloat(radius),
                cornerHeight: CGFloat(radius),
                transform: nil
            )

            context.addPath(clip)
            context.clip()

            if let background = backgroundColor {
                context.setFillColor(background.cgColor)
                context.fill(bounds)
            }

            drawItems(in: context, side: Double(side))
            context.resetClip()
            drawBorder(in: context, side: Double(side), radius: radius)
        }

        private func drawItems(in context: CGContext, side: Double) {
            let scale = scaleFactor(for: side)

            for placed in drawOrder {
                let item = placed.item
                guard !item.fragments.isEmpty else { continue }

                let origin = item.position.resolved(for: side)
                let rect = CGRect(
                    x: origin.x,
                    y: origin.y,
                    width: item.width * scale,
                    height: item.height * scale
                )
                guard rect.width > 0, rect.height > 0 else { continue }

                let color = colors[placed.category] ?? AvatuneColor(red: 0, green: 0, blue: 0)

                for (index, fragment) in item.fragments.enumerated() {
                    let key = SVGCache.Key(
                        theme: theme.name,
                        category: placed.category,
                        item: item.key,
                        fragment: index,
                        color: fragment.isColorIndependent ? nil : color.packed
                    )
                    guard let svg = SVGCache.shared.svg(for: key, build: { fragment.svg(color: color) })
                    else { continue }

                    context.draw(svg, effects: fragment.effects, in: rect)
                }
            }
        }

        private func drawBorder(in context: CGContext, side: Double, radius: Double) {
            guard let color = theme.style.borderColor, theme.style.borderWidth > 0 else {
                return
            }

            // SVG insets the border rect by half the stroke width but keeps the
            // same corner radius, so the native path has to do the same or the
            // corners drift.
            let inset = theme.style.borderWidth / 2
            let rect = CGRect(
                x: inset,
                y: inset,
                width: side - theme.style.borderWidth,
                height: side - theme.style.borderWidth
            )

            context.saveGState()
            context.addPath(
                CGPath(
                    roundedRect: rect,
                    cornerWidth: CGFloat(min(radius, rect.width / 2)),
                    cornerHeight: CGFloat(min(radius, rect.height / 2)),
                    transform: nil
                )
            )
            context.setStrokeColor(color.cgColor)
            context.setLineWidth(CGFloat(theme.style.borderWidth))
            context.strokePath()
            context.restoreGState()
        }
    }

    extension AvatuneColor {
        /// Built in device RGB rather than through `CGColor(red:green:blue:alpha:)`.
        ///
        /// That convenience initialiser produces a colour in a generic space,
        /// which Core Graphics then converts when filling into a device-RGB
        /// context — shifting every value slightly. The SVG engine builds its own
        /// colours in device RGB, so a background drawn the convenient way ends up
        /// a few units away from the artwork drawn on top of it.
        var cgColor: CGColor {
            let (red, green, blue, alpha) = components
            return CGColor(
                colorSpace: CGColorSpaceCreateDeviceRGB(),
                components: [
                    CGFloat(red), CGFloat(green), CGFloat(blue), CGFloat(alpha),
                ]
            ) ?? CGColor(gray: 0, alpha: CGFloat(alpha))
        }
    }

#endif
