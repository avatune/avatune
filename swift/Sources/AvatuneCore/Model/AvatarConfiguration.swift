/// An avatar request: which items to pin, which colours to override, and the
/// seed everything else is derived from.
///
/// The TypeScript `AvatarConfig` spells out roughly forty optional fields — one
/// identifier and one colour per category. Rather than transliterate that, this
/// stores two category-keyed maps and exposes them through subscripts. Generated
/// per-theme builders provide the typed, autocompleting surface on top.
public struct AvatarConfiguration: Hashable, Sendable {
    public var seed: AvatuneSeed?
    public var backgroundColor: AvatuneColor?
    public var cornerRadius: AvatuneLength?

    private var identifiers: [AvatarPartCategory: String] = [:]
    private var colors: [AvatarPartCategory: AvatuneColor] = [:]

    public init(
        seed: AvatuneSeed? = nil,
        backgroundColor: AvatuneColor? = nil,
        cornerRadius: AvatuneLength? = nil
    ) {
        self.seed = seed
        self.backgroundColor = backgroundColor
        self.cornerRadius = cornerRadius
    }

    /// The item pinned for a category, if any.
    public subscript(category: AvatarPartCategory) -> String? {
        get { identifiers[category] }
        set { identifiers[category] = newValue }
    }

    /// The colour override for a category, if any.
    public subscript(color category: AvatarPartCategory) -> AvatuneColor? {
        get { colors[category] }
        set { colors[category] = newValue }
    }

    public var pinnedCategories: [AvatarPartCategory] {
        identifiers.keys.sorted { $0.rawValue < $1.rawValue }
    }
}

extension AvatarConfiguration: Codable {
    /// Coding keys mirror the TypeScript `AvatarConfig` exactly, so a payload
    /// from the avatar API decodes without a translation layer.
    private struct DynamicKey: CodingKey {
        var stringValue: String
        var intValue: Int? { nil }

        init(_ value: String) { stringValue = value }
        init?(stringValue: String) { self.stringValue = stringValue }
        init?(intValue: Int) { nil }
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: DynamicKey.self)

        // `seed` is a string or a number, so the first attempt has to tolerate a
        // type mismatch rather than propagate it.
        if let text = try? container.decodeIfPresent(String.self, forKey: DynamicKey("seed")) {
            seed = .string(text)
        } else if let number = try container.decodeIfPresent(
            Double.self, forKey: DynamicKey("seed"))
        {
            seed = .number(number)
        }

        if let hex = try container.decodeIfPresent(
            String.self, forKey: DynamicKey("backgroundColor"))
        {
            backgroundColor = AvatuneColor(hex: hex)
        }
        cornerRadius = try container.decodeIfPresent(
            AvatuneLength.self, forKey: DynamicKey("borderRadius"))

        for category in AvatarPartCategory.allCases {
            if let value = try container.decodeIfPresent(
                String.self, forKey: DynamicKey(category.rawValue))
            {
                self[category] = value
            }
            if let hex = try container.decodeIfPresent(
                String.self, forKey: DynamicKey(category.colorKey))
            {
                self[color: category] = AvatuneColor(hex: hex)
            }
        }
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: DynamicKey.self)

        switch seed {
        case .string(let text): try container.encode(text, forKey: DynamicKey("seed"))
        case .number(let value): try container.encode(value, forKey: DynamicKey("seed"))
        case nil: break
        }

        try container.encodeIfPresent(
            backgroundColor?.hexString, forKey: DynamicKey("backgroundColor"))
        try container.encodeIfPresent(cornerRadius, forKey: DynamicKey("borderRadius"))

        for category in AvatarPartCategory.allCases {
            try container.encodeIfPresent(self[category], forKey: DynamicKey(category.rawValue))
            try container.encodeIfPresent(
                self[color: category]?.hexString, forKey: DynamicKey(category.colorKey))
        }
    }
}
