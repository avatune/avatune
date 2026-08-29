/// Anything that describes an avatar well enough to draw it.
///
/// The generated per-theme builders conform, which is what lets a view take
/// `KyuteAvatar(seed: "alice").hair(.bob)` directly rather than making the
/// caller resolve it first. `ResolvedAvatar` conforms too, so a caller who
/// already resolved one — to keep it out of a redraw — can pass that instead.
public protocol AvatarSpecifying {
    var theme: AvatuneTheme { get }
    var configuration: AvatarConfiguration { get }
    var predictions: Predictions? { get }
}

extension AvatarSpecifying {
    /// Runs selection, producing something cheap to draw repeatedly.
    ///
    /// Worth hoisting out of a view body: selection hashes strings and runs
    /// colour chains through HSL conversions, none of which depend on the size
    /// being drawn.
    public func resolved() -> ResolvedAvatar {
        ResolvedAvatar(
            theme: theme,
            configuration: configuration,
            predictions: predictions
        )
    }
}

extension ResolvedAvatar: AvatarSpecifying {
    public var configuration: AvatarConfiguration {
        var configuration = AvatarConfiguration(
            backgroundColor: selection.backgroundColor,
            cornerRadius: selection.cornerRadius
        )
        // Selection has already happened, so every choice is explicit. Rebuilding
        // from the result means re-resolving cannot pick anything different.
        for (category, identifier) in selection.identifiers {
            configuration[category] = identifier
        }
        for (category, color) in selection.colors {
            configuration[color: category] = color
        }
        return configuration
    }

    public var predictions: Predictions? { nil }

    /// Already resolved; returns itself rather than selecting again.
    public func resolved() -> ResolvedAvatar { self }
}
