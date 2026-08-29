#if canImport(QuartzCore)

    import AvatuneCore
    import CoreGraphics
    import QuartzCore

    /// A layer that draws an avatar, for view hierarchies that are not SwiftUI.
    ///
    /// Redraws vector-sharp at whatever `contentsScale` it is given, so a layer
    /// moved between displays stays crisp without the caller re-rendering.
    public final class AvatarLayer: CALayer {
        /// Setting this re-resolves nothing: the avatar is already resolved, so
        /// assigning it only schedules a redraw.
        public var avatar: ResolvedAvatar? {
            didSet { setNeedsDisplay() }
        }

        public override init() {
            super.init()
            needsDisplayOnBoundsChange = true
        }

        public convenience init(_ specification: some AvatarSpecifying) {
            self.init()
            avatar = specification.resolved()
        }

        public override init(layer: Any) {
            super.init(layer: layer)
            if let other = layer as? AvatarLayer {
                avatar = other.avatar
            }
            needsDisplayOnBoundsChange = true
        }

        public required init?(coder: NSCoder) {
            super.init(coder: coder)
            needsDisplayOnBoundsChange = true
        }

        public override class func needsDisplay(forKey key: String) -> Bool {
            key == "avatar" || super.needsDisplay(forKey: key)
        }

        public override func draw(in context: CGContext) {
            guard let avatar else { return }

            let size = CGSize(width: bounds.width, height: bounds.height)
            guard size.width > 0, size.height > 0 else { return }

            context.saveGState()
            defer { context.restoreGState() }

            // The orientation of a layer's context is not fixed: UIKit hands over
            // a top-left origin, AppKit a bottom-left one, and `isGeometryFlipped`
            // changes it again. Rather than assume a platform, read the transform
            // — a positive `d` means y still grows upwards and needs flipping.
            if context.ctm.d > 0 {
                context.translateBy(x: 0, y: size.height)
                context.scaleBy(x: 1, y: -1)
            }

            avatar.draw(in: context, size: size)
        }
    }

#endif
