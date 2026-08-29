/// How one colour-dependent site in a fragment's SVG is derived from the
/// category colour the selector assigned.
public enum ColorSlot: Hashable, Sendable {
    case themeColor
    case derived([ColorOperation])

    public func resolve(_ color: AvatuneColor) -> AvatuneColor {
        switch self {
        case .themeColor:
            return color
        case .derived(let operations):
            return Colord.apply(operations, to: color)
        }
    }
}

public enum BlendMode: Hashable, Sendable {
    case multiply
    case screen
}

/// An effect the SVG engine does not implement, applied by the renderer around
/// the fragment's draw.
public enum FragmentEffect: Hashable, Sendable {
    case blend(BlendMode)
    case dropShadow(dx: Double, dy: Double, stdDeviation: Double, color: AvatuneColor)
    case blur(stdDeviation: Double)
}

/// A slice of an item that can be drawn in one pass.
///
/// Artwork ships as a template rather than a finished document because the
/// avatar's colour is not known until selection runs. `segments` are the literal
/// spans of SVG and `slots` are the colours that go between them, so rebuilding
/// is a string interleave with no parsing.
///
/// Most items are a single fragment with no effects. An item is split only where
/// it carries a blend mode or a filter, which have to be applied around the draw
/// rather than inside the SVG.
public struct Fragment: Hashable, Sendable {
    public let segments: [String]
    public let slots: [ColorSlot]
    /// Applied outermost-first around this fragment's draw.
    public let effects: [FragmentEffect]

    public init(segments: [String], slots: [ColorSlot], effects: [FragmentEffect] = []) {
        self.segments = segments
        self.slots = slots
        self.effects = effects
    }

    /// True when the artwork does not depend on the avatar's colour, so a
    /// parsed copy can be cached once rather than per colour.
    public var isColorIndependent: Bool { slots.isEmpty }

    /// Rebuilds this fragment's SVG for a resolved colour.
    public func svg(color: AvatuneColor) -> String {
        guard !slots.isEmpty else { return segments.first ?? "" }

        var out = segments[0]
        out.reserveCapacity(segments.reduce(0) { $0 + $1.count } + slots.count * 7)
        for index in slots.indices {
            out += slots[index].resolve(color).hexString
            out += segments[index + 1]
        }
        return out
    }
}
