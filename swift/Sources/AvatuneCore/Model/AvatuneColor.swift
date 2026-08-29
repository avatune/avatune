import Foundation

/// An sRGB colour.
///
/// Channels are stored the way colord stores them — `red`, `green` and `blue`
/// in `0...255` as unrounded `Double`s, `alpha` in `0...1`. Keeping the
/// fractional precision matters: colord rounds only when formatting, so a chain
/// such as `.lighten(0.1).desaturate(0.2)` that rounded between steps would
/// drift from the web renderers by a unit or two per channel.
public struct AvatuneColor: Hashable, Sendable {
    /// Red channel in `0...255`, unrounded.
    public var red: Double
    /// Green channel in `0...255`, unrounded.
    public var green: Double
    /// Blue channel in `0...255`, unrounded.
    public var blue: Double
    /// Alpha in `0...1`.
    public var alpha: Double

    public init(red: Double, green: Double, blue: Double, alpha: Double = 1) {
        self.red = red
        self.green = green
        self.blue = blue
        self.alpha = alpha
    }

    /// Channel values normalised to `0...1`, for drawing APIs.
    public var components: (red: Double, green: Double, blue: Double, alpha: Double) {
        (red / 255, green / 255, blue / 255, alpha)
    }

    /// Parses `#RGB`, `#RGBA`, `#RRGGBB` or `#RRGGBBAA`.
    ///
    /// Mirrors colord's hex parser, including its handling of the short forms,
    /// where each nibble is doubled and the alpha byte is rounded to three
    /// decimal places.
    public init?(hex: String) {
        var digits = hex.hasPrefix("#") ? String(hex.dropFirst()) : hex
        guard digits.allSatisfy(\.isHexDigit) else { return nil }

        switch digits.count {
        case 3, 4:
            digits = digits.map { "\($0)\($0)" }.joined()
        case 6, 8:
            break
        default:
            return nil
        }

        func byte(_ offset: Int) -> Double {
            let start = digits.index(digits.startIndex, offsetBy: offset)
            let end = digits.index(start, offsetBy: 2)
            return Double(UInt8(digits[start..<end], radix: 16) ?? 0)
        }

        red = byte(0)
        green = byte(2)
        blue = byte(4)
        alpha = digits.count == 8 ? Colord.round(byte(6) / 255, places: 2) : 1
    }

    /// Builds an opaque colour from a packed `0xRRGGBB` literal.
    public static func hex(_ value: UInt32) -> AvatuneColor {
        AvatuneColor(
            red: Double((value >> 16) & 0xFF),
            green: Double((value >> 8) & 0xFF),
            blue: Double(value & 0xFF)
        )
    }

    /// Lowercase `#rrggbb`, with an alpha byte appended only when not opaque.
    ///
    /// Byte-compatible with colord's `toHex()`, which is what the generated
    /// colour fixtures compare against.
    public var hexString: String {
        func pair(_ value: Double) -> String {
            let byte = Int(Colord.round(value))
            let text = String(byte, radix: 16)
            return text.count < 2 ? "0\(text)" : text
        }

        let roundedAlpha = Colord.round(alpha, places: 3)
        let base = "#\(pair(red))\(pair(green))\(pair(blue))"
        return roundedAlpha < 1 ? base + pair(Colord.round(255 * roundedAlpha)) : base
    }
}

extension AvatuneColor: CustomStringConvertible {
    public var description: String { hexString }
}
