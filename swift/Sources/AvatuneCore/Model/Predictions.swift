/// Results from the ML predictors, used to steer selection towards a likeness.
///
/// Supplying predictions replaces the seed entirely: `selectItems` uses
/// `JSON.stringify(predictions)` as the base seed. That makes the seed depend
/// on JavaScript object key insertion order, which Swift cannot observe, so
/// `seedText` fixes a canonical order — the declaration order of the TypeScript
/// `Predictions` interface. Callers holding a seed string built by JavaScript
/// with a different key order can pass it through `rawSeed`.
public struct Predictions: Hashable, Sendable, Codable {
    public enum HairLength: String, Sendable, Codable, CaseIterable {
        case short, medium, long
    }

    public enum HairColor: String, Sendable, Codable, CaseIterable {
        case black, brown, blond, gray
    }

    public enum SkinTone: String, Sendable, Codable, CaseIterable {
        case dark, medium, light
    }

    public enum FacialHair: String, Sendable, Codable {
        case none
        case facialHair = "facial_hair"
    }

    public var hairLength: HairLength?
    public var hairColor: HairColor?
    public var skinTone: SkinTone?
    public var faceHair: FacialHair?

    /// Overrides `seedText` with a seed string produced elsewhere, for exact
    /// interop with a payload serialised by JavaScript.
    public var rawSeed: String?

    public init(
        hairLength: HairLength? = nil,
        hairColor: HairColor? = nil,
        skinTone: SkinTone? = nil,
        faceHair: FacialHair? = nil,
        rawSeed: String? = nil
    ) {
        self.hairLength = hairLength
        self.hairColor = hairColor
        self.skinTone = skinTone
        self.faceHair = faceHair
        self.rawSeed = rawSeed
    }

    private enum CodingKeys: String, CodingKey {
        case hairLength, hairColor, skinTone, faceHair
    }

    /// `JSON.stringify(predictions)` in the canonical key order, omitting
    /// absent values exactly as `JSON.stringify` omits `undefined`.
    public var seedText: String {
        if let rawSeed { return rawSeed }

        var parts: [String] = []
        if let hairLength { parts.append("\"hairLength\":\"\(hairLength.rawValue)\"") }
        if let hairColor { parts.append("\"hairColor\":\"\(hairColor.rawValue)\"") }
        if let skinTone { parts.append("\"skinTone\":\"\(skinTone.rawValue)\"") }
        if let faceHair { parts.append("\"faceHair\":\"\(faceHair.rawValue)\"") }
        return "{\(parts.joined(separator: ","))}"
    }
}
