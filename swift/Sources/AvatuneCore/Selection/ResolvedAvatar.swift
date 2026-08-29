/// An avatar whose items and colours have been decided, ready to draw.
///
/// Selection is deliberately a separate step from drawing. It hashes strings,
/// walks every category and runs colour chains through HSL conversions — work
/// that depends only on the configuration, not on the size being drawn. A view
/// that re-ran it per frame would repeat all of that sixty times a second for
/// an avatar that never changed, so callers resolve once and keep the result.
public struct ResolvedAvatar: Sendable {
    public let theme: AvatuneTheme
    public let selection: SelectionResult

    public init(
        theme: AvatuneTheme,
        configuration: AvatarConfiguration = AvatarConfiguration(),
        predictions: Predictions? = nil
    ) {
        self.theme = theme
        self.selection = ItemSelector.select(
            configuration: configuration,
            theme: theme,
            predictions: predictions
        )
    }

    public init(theme: AvatuneTheme, seed: AvatuneSeed) {
        self.init(theme: theme, configuration: AvatarConfiguration(seed: seed))
    }

    /// The item chosen for each category.
    public var identifiers: [AvatarPartCategory: String] { selection.identifiers }

    /// The colour assigned to each category, including categories with no item.
    public var colors: [AvatarPartCategory: AvatuneColor] { selection.colors }

    public var backgroundColor: AvatuneColor? { selection.backgroundColor }

    /// Ascending layer, ties broken by the theme's declaration order.
    public var drawOrder: [PlacedItem] { selection.drawOrder }

    /// Corner radius in points for a given rendered size.
    ///
    /// Clamped to half the side because SVG clamps `rx` the same way, and a
    /// theme asking for `100%` would otherwise produce a radius twice the size
    /// of the shape it rounds.
    public func cornerRadius(for size: Double) -> Double {
        guard let radius = selection.cornerRadius else { return 0 }
        return min(radius.resolved(for: size), size / 2)
    }

    /// Scale from the theme's authoring canvas to the rendered size.
    public func scaleFactor(for size: Double) -> Double {
        guard theme.style.size > 0 else { return 1 }
        return size / theme.style.size
    }
}
