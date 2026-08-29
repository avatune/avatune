/// A single colour transformation an asset can apply to its theme colour.
///
/// Asset packages express these as colord expressions in their build config
/// (`colord(color).lighten(0.53).desaturate(0.27).toHex()`). The generator
/// resolves each expression to a chain of these cases, so the runtime never
/// parses anything.
public enum ColorOperation: Hashable, Sendable {
    case lighten(Double)
    case darken(Double)
    case saturate(Double)
    case desaturate(Double)
    /// Degrees, which may be negative.
    case rotate(Double)

    public func callAsFunction(_ color: AvatuneColor) -> AvatuneColor {
        Colord.apply(self, to: color)
    }
}

extension ColorOperation: Codable {
    private enum CodingKeys: String, CodingKey {
        case op
        case amount
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        let name = try container.decode(String.self, forKey: .op)
        let amount = try container.decode(Double.self, forKey: .amount)

        switch name {
        case "lighten": self = .lighten(amount)
        case "darken": self = .darken(amount)
        case "saturate": self = .saturate(amount)
        case "desaturate": self = .desaturate(amount)
        case "rotate": self = .rotate(amount)
        default:
            throw DecodingError.dataCorruptedError(
                forKey: .op,
                in: container,
                debugDescription:
                    "Unsupported colour operation '\(name)'. Add it here and to Colord.apply before using it in an asset package."
            )
        }
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        switch self {
        case .lighten(let amount):
            try container.encode("lighten", forKey: .op)
            try container.encode(amount, forKey: .amount)
        case .darken(let amount):
            try container.encode("darken", forKey: .op)
            try container.encode(amount, forKey: .amount)
        case .saturate(let amount):
            try container.encode("saturate", forKey: .op)
            try container.encode(amount, forKey: .amount)
        case .desaturate(let amount):
            try container.encode("desaturate", forKey: .op)
            try container.encode(amount, forKey: .amount)
        case .rotate(let amount):
            try container.encode("rotate", forKey: .op)
            try container.encode(amount, forKey: .amount)
        }
    }
}
