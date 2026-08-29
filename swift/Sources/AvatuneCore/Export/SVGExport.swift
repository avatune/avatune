import Foundation

extension ResolvedAvatar {
    /// Composes the avatar as a standalone SVG document.
    ///
    /// Mirrors what `@avatune/vanilla` produces: a clipped group holding each
    /// item's own `<svg>` inside a translated, scaled `<g>`, with the background
    /// behind and the border on top.
    ///
    /// Pure string work, so it lives in Core and needs no drawing stack — which
    /// also makes it usable server-side or anywhere a vector is wanted instead of
    /// a bitmap.
    public func svg(size: Double? = nil) -> String {
        let side = size ?? theme.style.size
        let scale = scaleFactor(for: side)
        let radius = cornerRadius(for: side)

        var out = """
            <svg xmlns="http://www.w3.org/2000/svg" width="\(number(side))" \
            height="\(number(side))" viewBox="0 0 \(number(side)) \(number(side))">
            """

        let clipID = "avatune-clip"
        out += """
            <defs><clipPath id="\(clipID)"><rect x="0" y="0" \
            width="\(number(side))" height="\(number(side))" \
            rx="\(number(radius))" ry="\(number(radius))"/></clipPath></defs>
            """

        if let background = backgroundColor {
            out += """
                <rect x="0" y="0" width="\(number(side))" height="\(number(side))" \
                rx="\(number(radius))" ry="\(number(radius))" fill="\(background.hexString)"/>
                """
        }

        out += #"<g clip-path="url(#\#(clipID))">"#

        var definitions = ""
        for (index, placed) in drawOrder.enumerated() {
            let item = placed.item
            guard !item.fragments.isEmpty else { continue }

            let origin = item.position.resolved(for: side)
            let color = colors[placed.category] ?? AvatuneColor(red: 0, green: 0, blue: 0)

            out += """
                <g transform="translate(\(number(origin.x)), \(number(origin.y))) \
                scale(\(number(scale)))">
                """

            for (fragmentIndex, fragment) in item.fragments.enumerated() {
                // Ids are document-global in SVG, and every item's artwork uses
                // the same generated names. Without a per-item prefix the second
                // item's `url(#a0)` would resolve to the first item's mask.
                let prefix = "i\(index)f\(fragmentIndex)-"
                let body = namespacingIDs(fragment.svg(color: color), prefix: prefix)

                let (open, close, definition) = wrapping(
                    fragment.effects, prefix: prefix
                )
                definitions += definition
                out += open + body + close
            }

            out += "</g>"
        }

        out += "</g>"

        if let border = theme.style.borderColor, theme.style.borderWidth > 0 {
            let inset = theme.style.borderWidth / 2
            out += """
                <rect x="\(number(inset))" y="\(number(inset))" \
                width="\(number(side - theme.style.borderWidth))" \
                height="\(number(side - theme.style.borderWidth))" \
                rx="\(number(radius))" ry="\(number(radius))" fill="none" \
                stroke="\(border.hexString)" stroke-width="\(number(theme.style.borderWidth))"/>
                """
        }

        if !definitions.isEmpty {
            out += "<defs>\(definitions)</defs>"
        }

        return out + "</svg>"
    }

    /// Rebuilds the effects that were hoisted out of the artwork for native
    /// drawing, so an exported document renders the same as the web original.
    private func wrapping(
        _ effects: [FragmentEffect],
        prefix: String
    ) -> (open: String, close: String, definitions: String) {
        guard !effects.isEmpty else { return ("", "", "") }

        var attributes = ""
        var definitions = ""

        for (index, effect) in effects.enumerated() {
            switch effect {
            case .blend(let mode):
                attributes += #" style="mix-blend-mode:\#(mode == .multiply ? "multiply" : "screen")""#

            case .blur(let stdDeviation):
                let id = "\(prefix)blur\(index)"
                definitions += """
                    <filter id="\(id)" x="-50%" y="-50%" width="200%" height="200%">\
                    <feGaussianBlur stdDeviation="\(number(stdDeviation))"/></filter>
                    """
                attributes += #" filter="url(#\#(id))""#

            case .dropShadow(let dx, let dy, let stdDeviation, let color):
                let id = "\(prefix)shadow\(index)"
                definitions += """
                    <filter id="\(id)" x="-50%" y="-50%" width="200%" height="200%">\
                    <feDropShadow dx="\(number(dx))" dy="\(number(dy))" \
                    stdDeviation="\(number(stdDeviation))" \
                    flood-color="\(color.opaqueHexString)" \
                    flood-opacity="\(number(color.alpha))"/></filter>
                    """
                attributes += #" filter="url(#\#(id))""#
            }
        }

        return ("<g\(attributes)>", "</g>", definitions)
    }

    /// Prefixes every `id` and `url(#…)` in one item's artwork.
    private func namespacingIDs(_ svg: String, prefix: String) -> String {
        guard svg.contains(#"id=""#) else { return svg }
        return
            svg
            .replacingOccurrences(
                of: #"id="([^"]+)""#,
                with: #"id="\#(prefix)$1""#,
                options: .regularExpression
            )
            .replacingOccurrences(
                of: #"url\(#([^)]+)\)"#,
                with: #"url(#\#(prefix)$1)"#,
                options: .regularExpression
            )
    }

    /// Trims the trailing `.0` that Swift adds to whole numbers, so the output
    /// reads like the JavaScript renderer's.
    private func number(_ value: Double) -> String {
        value == value.rounded() && abs(value) < 1e15
            ? String(Int64(value))
            : String(value)
    }
}

extension AvatuneColor {
    /// `#rrggbb` with no alpha byte, for attributes that carry opacity separately.
    var opaqueHexString: String {
        var opaque = self
        opaque.alpha = 1
        return opaque.hexString
    }
}
