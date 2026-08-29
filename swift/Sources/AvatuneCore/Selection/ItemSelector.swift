import Foundation

/// An item that will be drawn, with the category that chose it.
public struct PlacedItem: Sendable, Hashable {
    public let category: AvatarPartCategory
    public let item: ItemDescriptor

    public init(category: AvatarPartCategory, item: ItemDescriptor) {
        self.category = category
        self.item = item
    }
}

/// What a configuration resolves to: one item and one colour per category.
public struct SelectionResult: Sendable {
    public let identifiers: [AvatarPartCategory: String]
    public let colors: [AvatarPartCategory: AvatuneColor]
    public let backgroundColor: AvatuneColor?
    public let cornerRadius: AvatuneLength?
    /// Categories carrying an item, in draw order: ascending layer, ties broken
    /// by declaration order.
    public let drawOrder: [PlacedItem]
}

/// A port of `selectItems` from `@avatune/utils`.
///
/// Behaviour worth stating explicitly, because it is easy to "clean up" into
/// something subtly different:
///
///  - Categories are visited in palette-declaration order, and connected
///    colours read the colours assigned earlier in that same pass. Visiting
///    them in any other order changes the output.
///  - A category with a palette but no items still receives a colour.
///  - Where a collection offers `none`, it is weighted at two thirds rather
///    than shared uniformly with the rest.
///  - Each category draws its own random values from the base seed, so pinning
///    one category does not disturb the others.
public enum ItemSelector {
    /// The share of the random range reserved for `none` where a collection
    /// offers it.
    private static let noneWeight = 2.0 / 3.0

    private static let defaultSeed = "avatune"

    public static func select(
        configuration: AvatarConfiguration,
        theme: AvatuneTheme,
        predictions: Predictions? = nil
    ) -> SelectionResult {
        let baseSeed = predictions?.seedText ?? configuration.seed?.text ?? defaultSeed

        func random(_ key: String) -> Double {
            SeededRandom.first(seed: "\(baseSeed)-\(key)")
        }

        let backgroundColor =
            configuration.backgroundColor
            ?? pick(theme.backgroundPalette, random("background"))
        let cornerRadius = configuration.cornerRadius ?? theme.style.borderRadius

        var identifiers: [AvatarPartCategory: String] = [:]
        var colors: [AvatarPartCategory: AvatuneColor] = [:]
        var ordered: [(category: AvatarPartCategory, item: ItemDescriptor, rank: Int)] = []

        for (rank, category) in theme.categories.enumerated() {
            let itemRandom = random("\(category.category.rawValue)-item")
            let colorRandom = random("\(category.category.rawValue)-color")

            if let identifier = selectIdentifier(
                category: category,
                configuration: configuration,
                predictions: predictions,
                theme: theme,
                random: itemRandom
            ), let item = category.item(named: identifier) {
                identifiers[category.category] = identifier
                ordered.append((category.category, item, rank))
            }

            if let color = selectColor(
                category: category,
                configuration: configuration,
                predictions: predictions,
                theme: theme,
                assigned: colors,
                random: colorRandom
            ) {
                colors[category.category] = color
            }
        }

        // Stable by construction: Swift's sort is not guaranteed stable, and
        // themes deliberately give different categories the same layer to rely
        // on declaration order.
        let drawOrder =
            ordered
            .sorted { ($0.item.layer, $0.rank) < ($1.item.layer, $1.rank) }
            .map { PlacedItem(category: $0.category, item: $0.item) }

        return SelectionResult(
            identifiers: identifiers,
            colors: colors,
            backgroundColor: backgroundColor,
            cornerRadius: cornerRadius,
            drawOrder: drawOrder
        )
    }

    // MARK: - Identifier

    /// Explicit configuration wins, then a predictor's suggestion, then the
    /// seeded fallback.
    private static func selectIdentifier(
        category: AvatuneTheme.Category,
        configuration: AvatarConfiguration,
        predictions: Predictions?,
        theme: AvatuneTheme,
        random: Double
    ) -> String? {
        if let explicit = configuration[category.category] {
            return explicit
        }

        if let predictions,
            let candidates = predictorIdentifiers(
                for: category.category, predictions: predictions, theme: theme),
            let picked = pick(candidates, random)
        {
            return picked
        }

        return weightedItem(in: category.items, random: random)?.key
    }

    private static func predictorIdentifiers(
        for category: AvatarPartCategory,
        predictions: Predictions,
        theme: AvatuneTheme
    ) -> [String]? {
        guard let mappings = theme.predictorMappings else { return nil }

        switch category {
        case .hair:
            guard let length = predictions.hairLength else { return nil }
            return mappings.hair[length.rawValue]
        case .faceHair:
            guard let faceHair = predictions.faceHair else { return nil }
            return mappings.faceHair[faceHair.rawValue]
        default:
            return nil
        }
    }

    /// Picks an item, giving `none` a larger share where the collection offers
    /// it, so optional parts stay absent more often than not.
    private static func weightedItem(
        in items: [ItemDescriptor],
        random: Double
    ) -> ItemDescriptor? {
        guard !items.isEmpty else { return nil }

        let none = items.first { $0.key == "none" }
        let named = items.filter { $0.key != "none" }

        guard none != nil, !named.isEmpty else {
            return items[min(Int(Double(items.count) * random), items.count - 1)]
        }

        if random < noneWeight {
            return none
        }

        let scaled = (random - noneWeight) / (1 - noneWeight)
        return named[min(Int(Double(named.count) * scaled), named.count - 1)]
    }

    // MARK: - Colour

    /// Explicit configuration wins, then a connected category's colour, then a
    /// predictor's suggestion, then the palette.
    private static func selectColor(
        category: AvatuneTheme.Category,
        configuration: AvatarConfiguration,
        predictions: Predictions?,
        theme: AvatuneTheme,
        assigned: [AvatarPartCategory: AvatuneColor],
        random: Double
    ) -> AvatuneColor? {
        if let explicit = configuration[color: category.category] {
            return explicit
        }

        if let source = theme.colorSource(for: category.category) {
            if let inherited = assigned[source] {
                return inherited
            }
            // Matches the JavaScript, which falls through when the source has
            // not been assigned yet rather than treating the link as absent.
        }

        if let predictions,
            let candidates = predictorColors(
                for: category.category, predictions: predictions, theme: theme),
            let picked = pick(candidates, random)
        {
            return picked
        }

        return pick(category.palette, random)
    }

    private static func predictorColors(
        for category: AvatarPartCategory,
        predictions: Predictions,
        theme: AvatuneTheme
    ) -> [AvatuneColor]? {
        guard let mappings = theme.predictorMappings else { return nil }

        switch category {
        case .hair, .eyebrows:
            guard let hairColor = predictions.hairColor else { return nil }
            return mappings.hairColor[hairColor.rawValue]
        case .head, .ears:
            guard let skinTone = predictions.skinTone else { return nil }
            return mappings.skinTone[skinTone.rawValue]
        default:
            return nil
        }
    }

    // MARK: - Shared

    private static func pick<T>(_ values: [T], _ random: Double) -> T? {
        guard !values.isEmpty else { return nil }
        return values[min(Int(Double(values.count) * random), values.count - 1)]
    }
}
