import Foundation

/// The string hash the web renderers use to derive per-category randomness.
///
/// Three details are load-bearing and each one is a silent failure if missed:
///
///  - JavaScript's `charCodeAt` walks UTF-16 code units, so this iterates
///    `String.utf16`. Iterating `unicodeScalars` instead changes the hash of
///    every string containing an emoji or other non-BMP character.
///  - `hash << 5` wraps to 32 bits *before* the subtraction, so the shift has to
///    wrap and the arithmetic after it has to be wide.
///  - `Math.abs` of `Int32.min` is 2147483648 in JavaScript, which is not
///    representable as an `Int32` and traps in Swift. The value widens to
///    `Int64` before the absolute value is taken.
public func avatuneHashString(_ string: String) -> Int64 {
    var hash: Int32 = 0
    for unit in string.utf16 {
        let shifted = hash &<< 5
        let sum = Int64(shifted) - Int64(hash) + Int64(unit)
        hash = Int32(truncatingIfNeeded: sum)
    }
    return abs(Int64(hash))
}

/// The seed for a random sequence: either a string or a number.
///
/// Numbers are stringified before hashing, so `AvatuneSeed` also owns the
/// formatting rule — JavaScript renders an integral `Double` as `1`, whereas
/// Swift's `description` renders `1.0`.
public enum AvatuneSeed: Hashable, Sendable, ExpressibleByStringLiteral, ExpressibleByIntegerLiteral {
    case string(String)
    case number(Double)

    public init(stringLiteral value: String) { self = .string(value) }
    public init(integerLiteral value: Int) { self = .number(Double(value)) }

    /// The seed as JavaScript's `String(value)` would render it.
    public var text: String {
        switch self {
        case .string(let value):
            return value
        case .number(let value):
            return AvatuneSeed.javaScriptString(value)
        }
    }

    /// Formats a `Double` the way JavaScript's `String()` does.
    ///
    /// Only the cases seeds actually take are handled exactly: integral values
    /// lose the trailing `.0` that Swift adds, and everything else relies on
    /// Swift's shortest-round-trip description, which matches JavaScript's for
    /// the magnitudes seeds occupy. Exponent-notation thresholds differ, so
    /// callers are better served by string seeds.
    static func javaScriptString(_ value: Double) -> String {
        guard value.isFinite else {
            return value.isNaN ? "NaN" : (value > 0 ? "Infinity" : "-Infinity")
        }
        if value == value.rounded(), abs(value) < 1e21 {
            return String(Int64(value))
        }
        return String(value)
    }
}

/// A reproduction of the linear congruential generator in `@avatune/utils`.
///
/// Arithmetic is `Double` rather than integer for two reasons: it matches
/// JavaScript exactly, and it stays exact. The intermediate peaks around
/// 1.9e13 when seeded from a hash — far past `Int32`, but well inside the 2^53
/// range where `Double` represents every integer.
public struct SeededRandom {
    private var value: Double

    public init(seed: AvatuneSeed) {
        switch seed {
        case .string(let text):
            value = Double(avatuneHashString(text))
        case .number(let number):
            value = number
        }
    }

    public init(seed: String) {
        self.init(seed: .string(seed))
    }

    public mutating func next() -> Double {
        value = (value * 9301 + 49297).truncatingRemainder(dividingBy: 233_280)
        return value / 233_280
    }

    /// The first draw for a seed, which is all `selectItems` ever takes.
    public static func first(seed: String) -> Double {
        var generator = SeededRandom(seed: seed)
        return generator.next()
    }
}
