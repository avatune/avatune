import Foundation

/// A length that is either absolute or relative to the avatar's size.
///
/// Mirrors the TypeScript `number | string` used for `borderRadius` and
/// `borderWidth`, where a string may carry a `%` suffix.
public enum AvatuneLength: Hashable, Sendable {
    case points(Double)
    case percent(Double)

    /// Resolves against an avatar size, matching `parseBorderRadius`.
    public func resolved(for size: Double) -> Double {
        switch self {
        case .points(let value):
            return value
        case .percent(let value):
            return value / 100 * size
        }
    }

    /// Parses the `number | string` forms the theme packages emit. A string
    /// without a `%` is read as points, matching `Number.parseFloat`.
    public init?(token: String) {
        let trimmed = token.trimmingCharacters(in: .whitespaces)
        let numeric = trimmed.prefix { "+-.0123456789eE".contains($0) }
        guard let value = Double(numeric) else { return nil }
        self = trimmed.contains("%") ? .percent(value) : .points(value)
    }
}

extension AvatuneLength: Codable {
    public init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        if let value = try? container.decode(Double.self) {
            self = .points(value)
            return
        }
        let token = try container.decode(String.self)
        guard let parsed = AvatuneLength(token: token) else {
            throw DecodingError.dataCorruptedError(
                in: container,
                debugDescription: "Cannot read '\(token)' as a length."
            )
        }
        self = parsed
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        switch self {
        case .points(let value):
            try container.encode(value)
        case .percent(let value):
            try container.encode("\(value)%")
        }
    }
}
