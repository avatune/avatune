#if canImport(SwiftUI) && canImport(CoreGraphics)

    import AvatuneCore
    import SwiftUI

    /// Draws an Avatune avatar, filling the space it is given.
    ///
    /// Backed by `Canvas`, so the avatar redraws at whatever size and scale the
    /// layout resolves to rather than being rasterised once and stretched.
    /// Selection runs when the avatar changes, not per frame.
    @available(iOS 15, macOS 12, tvOS 15, watchOS 8, *)
    public struct AvatarView: View {
        private let avatar: ResolvedAvatar

        public init(_ avatar: ResolvedAvatar) {
            self.avatar = avatar
        }

        /// Takes a generated builder directly, so a call site reads
        /// `AvatarView(KyuteAvatar(seed: "alice").hair(.bob))`.
        public init(_ specification: some AvatarSpecifying) {
            self.avatar = specification.resolved()
        }

        public init(
            _ theme: AvatuneTheme,
            seed: AvatuneSeed,
            configuration: AvatarConfiguration = AvatarConfiguration()
        ) {
            var configuration = configuration
            configuration.seed = seed
            self.avatar = ResolvedAvatar(theme: theme, configuration: configuration)
        }

        public var body: some View {
            Canvas(rendersAsynchronously: false) { context, size in
                context.withCGContext { cgContext in
                    avatar.draw(in: cgContext, size: size)
                }
            }
            .accessibilityHidden(true)
        }
    }

#endif
