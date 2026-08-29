/// Where an item sits within the avatar, as a linear function of its size.
///
/// Every theme position in the repo is linear, which the generator verifies by
/// probing rather than assuming.
public struct ItemPosition: Hashable, Sendable {
    public var xAbs: Double
    public var xRatio: Double
    public var yAbs: Double
    public var yRatio: Double

    public init(xAbs: Double, xRatio: Double, yAbs: Double, yRatio: Double) {
        self.xAbs = xAbs
        self.xRatio = xRatio
        self.yAbs = yAbs
        self.yRatio = yRatio
    }

    public func resolved(for size: Double) -> (x: Double, y: Double) {
        (xAbs + size * xRatio, yAbs + size * yRatio)
    }
}

/// One selectable item within a category.
public struct ItemDescriptor: Hashable, Sendable {
    public let key: String
    /// Higher values draw on top. Equal layers keep their declaration order.
    public let layer: Int
    public let position: ItemPosition
    /// The artwork's own viewport, scaled by `size / theme.style.size` when drawn.
    public let width: Double
    public let height: Double
    /// Empty for `none` items, which draw nothing.
    public let fragments: [Fragment]

    public init(
        key: String,
        layer: Int,
        position: ItemPosition,
        width: Double = 0,
        height: Double = 0,
        fragments: [Fragment] = []
    ) {
        self.key = key
        self.layer = layer
        self.position = position
        self.width = width
        self.height = height
        self.fragments = fragments
    }

    public var drawsSomething: Bool { !fragments.isEmpty }
}

/// A category whose colour follows another category's.
public struct ConnectedColor: Hashable, Sendable {
    public let dependent: AvatarPartCategory
    public let source: AvatarPartCategory

    public init(dependent: AvatarPartCategory, source: AvatarPartCategory) {
        self.dependent = dependent
        self.source = source
    }
}

public struct AvatuneTheme: Sendable {
    public struct Style: Hashable, Sendable {
        public var size: Double
        public var backgroundColor: AvatuneColor?
        public var borderColor: AvatuneColor?
        public var borderWidth: Double
        public var borderRadius: AvatuneLength?

        public init(
            size: Double,
            backgroundColor: AvatuneColor? = nil,
            borderColor: AvatuneColor? = nil,
            borderWidth: Double = 0,
            borderRadius: AvatuneLength? = nil
        ) {
            self.size = size
            self.backgroundColor = backgroundColor
            self.borderColor = borderColor
            self.borderWidth = borderWidth
            self.borderRadius = borderRadius
        }
    }

    /// A palette entry together with whatever items the theme defines for it.
    ///
    /// `items` may be empty: a theme can declare a palette for a category it
    /// has no artwork for, and that category still takes part in colour
    /// selection.
    public struct Category: Sendable {
        public let category: AvatarPartCategory
        public let palette: [AvatuneColor]
        public let items: [ItemDescriptor]

        public init(
            category: AvatarPartCategory,
            palette: [AvatuneColor],
            items: [ItemDescriptor]
        ) {
            self.category = category
            self.palette = palette
            self.items = items
        }

        func item(named key: String) -> ItemDescriptor? {
            items.first { $0.key == key }
        }
    }

    public struct PredictorMappings: Sendable {
        public var hair: [String: [String]]
        public var faceHair: [String: [String]]
        public var hairColor: [String: [AvatuneColor]]
        public var skinTone: [String: [AvatuneColor]]

        public init(
            hair: [String: [String]] = [:],
            faceHair: [String: [String]] = [:],
            hairColor: [String: [AvatuneColor]] = [:],
            skinTone: [String: [AvatuneColor]] = [:]
        ) {
            self.hair = hair
            self.faceHair = faceHair
            self.hairColor = hairColor
            self.skinTone = skinTone
        }
    }

    /// Short name, matching the theme package (`kyute`, `ashley-seo`).
    /// Used as a cache namespace, so two themes never share a parsed drawing.
    public let name: String

    public let style: Style
    public let backgroundPalette: [AvatuneColor]

    /// In palette-declaration order.
    ///
    /// The order is load-bearing, not cosmetic: selection walks these in
    /// sequence and resolves connected colours against categories already
    /// visited, so reordering silently changes the colours a theme produces.
    /// This is an array rather than a dictionary for exactly that reason.
    public let categories: [Category]

    public let connectedColors: [ConnectedColor]
    public let predictorMappings: PredictorMappings?

    public init(
        name: String,
        style: Style,
        backgroundPalette: [AvatuneColor],
        categories: [Category],
        connectedColors: [ConnectedColor] = [],
        predictorMappings: PredictorMappings? = nil
    ) {
        self.name = name
        self.style = style
        self.backgroundPalette = backgroundPalette
        self.categories = categories
        self.connectedColors = connectedColors
        self.predictorMappings = predictorMappings
    }

    func category(_ category: AvatarPartCategory) -> Category? {
        categories.first { $0.category == category }
    }

    func colorSource(for category: AvatarPartCategory) -> AvatarPartCategory? {
        connectedColors.first { $0.dependent == category }?.source
    }
}
