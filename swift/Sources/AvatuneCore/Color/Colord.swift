import Foundation

/// A port of the colord operations the Avatune asset packages use.
///
/// This is a deliberate transliteration of `colord@2.9`, not a reimplementation
/// from colour-science first principles, because colord does not use the
/// textbook HSL formulas:
///
///  - RGB reaches HSL *through HSV*, and HSL converts back the same way. The
///    usual direct formulas give answers that differ by one or two units per
///    channel almost everywhere.
///  - `rotate` rounds the hue to an integer before adding its argument.
///  - Hue normalisation maps 0 to 360 rather than leaving it at 0.
///  - JavaScript's `Math.round` is `floor(x + 0.5)`, which differs from Swift's
///    `rounded()` for negative halves.
///
/// Getting any of these wrong is silent: every theme renders, just slightly
/// wrong. `ColordParityTests` pins the behaviour against values produced by the
/// real library.
public enum Colord {
    /// Hue, saturation, value. Saturation and value are percentages.
    struct HSVA {
        var h: Double
        var s: Double
        var v: Double
        var a: Double
    }

    /// Hue, saturation, lightness. Saturation and lightness are percentages.
    struct HSLA {
        var h: Double
        var s: Double
        var l: Double
        var a: Double
    }

    /// JavaScript `Math.round`, which rounds halves towards positive infinity
    /// rather than away from zero.
    static func round(_ value: Double, places: Int = 0) -> Double {
        let scale = pow(10.0, Double(places))
        return (scale * value + 0.5).rounded(.down) / scale
    }

    static func clamp(_ value: Double, _ minimum: Double = 0, _ maximum: Double = 1) -> Double {
        value > maximum ? maximum : (value > minimum ? value : minimum)
    }

    /// colord's hue normalisation. Note that 0 comes back as 360.
    static func normalizeHue(_ value: Double) -> Double {
        let wrapped = value.isFinite ? value.truncatingRemainder(dividingBy: 360) : 0
        return wrapped > 0 ? wrapped : wrapped + 360
    }

    static func rgbaToHsva(_ color: AvatuneColor) -> HSVA {
        let maximum = max(color.red, color.green, color.blue)
        let delta = maximum - min(color.red, color.green, color.blue)

        let sector: Double
        if delta == 0 {
            sector = 0
        } else if maximum == color.red {
            sector = (color.green - color.blue) / delta
        } else if maximum == color.green {
            sector = 2 + (color.blue - color.red) / delta
        } else {
            sector = 4 + (color.red - color.green) / delta
        }

        return HSVA(
            h: 60 * (sector < 0 ? sector + 6 : sector),
            s: maximum == 0 ? 0 : delta / maximum * 100,
            v: maximum / 255 * 100,
            a: color.alpha
        )
    }

    static func hsvaToRgba(_ hsva: HSVA) -> AvatuneColor {
        let hue = hsva.h / 360 * 6
        let saturation = hsva.s / 100
        let value = hsva.v / 100

        let sector = hue.rounded(.down)
        let low = value * (1 - saturation)
        let falling = value * (1 - (hue - sector) * saturation)
        let rising = value * (1 - (1 - hue + sector) * saturation)

        let index = ((Int(sector) % 6) + 6) % 6
        let reds = [value, falling, low, low, rising, value]
        let greens = [rising, value, value, falling, low, low]
        let blues = [low, low, rising, value, value, falling]

        return AvatuneColor(
            red: 255 * reds[index],
            green: 255 * greens[index],
            blue: 255 * blues[index],
            alpha: hsva.a
        )
    }

    static func rgbaToHsla(_ color: AvatuneColor) -> HSLA {
        let hsva = rgbaToHsva(color)
        let combined: Double = (200 - hsva.s) * hsva.v / 100

        var saturation: Double = 0
        if combined > 0, combined < 200 {
            let divisor: Double = combined <= 100 ? combined : 200 - combined
            saturation = hsva.s * hsva.v / 100 / divisor * 100
        }

        return HSLA(h: hsva.h, s: saturation, l: combined / 2, a: hsva.a)
    }

    /// Converts HSL to RGB, clamping the way colord's parser does on the way in.
    /// Hue normalisation happens here, which is why operations can hand over an
    /// out-of-range hue without normalising it themselves.
    static func hslaToRgba(_ hsla: HSLA) -> AvatuneColor {
        let hue = normalizeHue(hsla.h)
        let saturation = clamp(hsla.s, 0, 100)
        let lightness = clamp(hsla.l, 0, 100)
        let alpha = clamp(hsla.a)

        let scaled = saturation * ((lightness < 50 ? lightness : 100 - lightness) / 100)
        return hsvaToRgba(
            HSVA(
                h: hue,
                s: scaled > 0 ? 2 * scaled / (lightness + scaled) * 100 : 0,
                v: lightness + scaled,
                a: alpha
            )
        )
    }

    /// colord's `hue()` getter, which rounds to a whole degree.
    static func hue(of color: AvatuneColor) -> Double {
        round(rgbaToHsla(color).h)
    }

    public static func apply(_ operation: ColorOperation, to color: AvatuneColor) -> AvatuneColor {
        var hsla = rgbaToHsla(color)

        switch operation {
        case .lighten(let amount):
            hsla.l = clamp(hsla.l + 100 * amount, 0, 100)
        case .darken(let amount):
            hsla.l = clamp(hsla.l - 100 * amount, 0, 100)
        case .saturate(let amount):
            hsla.s = clamp(hsla.s + 100 * amount, 0, 100)
        case .desaturate(let amount):
            hsla.s = clamp(hsla.s - 100 * amount, 0, 100)
        case .rotate(let amount):
            // The hue is read back rounded, then offset; saturation and
            // lightness stay at full precision.
            hsla.h = hue(of: color) + amount
        }

        return hslaToRgba(hsla)
    }

    public static func apply(_ operations: [ColorOperation], to color: AvatuneColor) -> AvatuneColor {
        operations.reduce(color) { apply($1, to: $0) }
    }
}
