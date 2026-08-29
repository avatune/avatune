#if canImport(CoreGraphics)

    import AvatuneCore
    import CoreGraphics
    import Foundation

    #if canImport(UIKit)
        import UIKit
    #elseif canImport(AppKit)
        import AppKit
    #endif

    /// Rasterises an avatar, for the places a SwiftUI view cannot go — table
    /// cells, notification attachments, share sheets, anything wanting an image.
    public enum AvatarImageRenderer {
        /// Renders whatever describes an avatar, resolving it first if needed.
        public static func cgImage(
            _ specification: some AvatarSpecifying,
            size: Double,
            scale: Double = 1
        ) -> CGImage? {
            cgImage(specification.resolved(), size: size, scale: scale)
        }

        /// Renders to a bitmap at `size` points and `scale` pixels per point.
        public static func cgImage(
            _ avatar: ResolvedAvatar,
            size: Double,
            scale: Double = 1
        ) -> CGImage? {
            let pixels = Int((size * scale).rounded())
            guard pixels > 0 else { return nil }

            guard
                let context = CGContext(
                    data: nil,
                    width: pixels,
                    height: pixels,
                    bitsPerComponent: 8,
                    bytesPerRow: 0,
                    space: CGColorSpaceCreateDeviceRGB(),
                    bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
                )
            else { return nil }

            context.scaleBy(x: CGFloat(scale), y: CGFloat(scale))

            // A bitmap context is bottom-up; `draw(in:size:)` expects a top-left
            // origin. Flipped here, after the scale, so the translation is in
            // points rather than pixels.
            context.translateBy(x: 0, y: CGFloat(size))
            context.scaleBy(x: 1, y: -1)

            avatar.draw(in: context, size: CGSize(width: size, height: size))
            return context.makeImage()
        }

        #if canImport(UIKit)
            public static func image(
                _ avatar: ResolvedAvatar,
                size: Double,
                scale: Double = 0
            ) -> UIImage? {
                let scale = scale > 0 ? scale : Double(UIScreen.main.scale)
                guard let cgImage = cgImage(avatar, size: size, scale: scale) else {
                    return nil
                }
                return UIImage(cgImage: cgImage, scale: CGFloat(scale), orientation: .up)
            }
        #elseif canImport(AppKit)
            public static func image(
                _ avatar: ResolvedAvatar,
                size: Double,
                scale: Double = 0
            ) -> NSImage? {
                let scale = scale > 0 ? scale : (NSScreen.main?.backingScaleFactor).map(Double.init) ?? 1
                guard let cgImage = cgImage(avatar, size: size, scale: scale) else {
                    return nil
                }
                return NSImage(
                    cgImage: cgImage,
                    size: NSSize(width: size, height: size)
                )
            }
        #endif
    }

#endif
