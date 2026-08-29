#if canImport(CoreGraphics)

    import AvatuneCore
    import Foundation
    import SwiftDraw

    /// Caches parsed artwork, keyed by the fragment and the colour it was built for.
    ///
    /// Parsing dominates rendering — roughly two milliseconds per item against a
    /// fifth of that to draw — and the same handful of items recur constantly in a
    /// list of avatars. Because palettes are finite, the cache warms quickly and
    /// steady-state drawing costs only the draw.
    ///
    /// The key is composed from identifiers rather than the SVG itself: hashing
    /// tens of kilobytes of path data on every frame would cost more than the parse
    /// it avoids.
    final class SVGCache: @unchecked Sendable {
        struct Key: Hashable {
            let theme: String
            let category: AvatarPartCategory
            let item: String
            let fragment: Int
            /// Packed RGBA, or nil where the artwork does not depend on colour.
            let color: UInt32?
        }

        static let shared = SVGCache()

        private let lock = NSLock()
        private var entries: [Key: SVG] = [:]
        private var order: [Key] = []

        /// Bounded so a long-lived process cycling through many themes and colours
        /// cannot grow without limit. Large enough that a screenful of avatars
        /// never evicts anything it is about to reuse.
        private let capacity = 512

        func svg(for key: Key, build: () -> String) -> SVG? {
            lock.lock()
            if let cached = entries[key] {
                lock.unlock()
                return cached
            }
            lock.unlock()

            // Built outside the lock: parsing is the expensive part, and holding
            // the lock through it would serialise every concurrent render.
            guard let parsed = SVG(xml: build()) else { return nil }

            lock.lock()
            defer { lock.unlock() }
            if let raced = entries[key] { return raced }

            entries[key] = parsed
            order.append(key)
            if order.count > capacity {
                let evicted = order.removeFirst()
                entries.removeValue(forKey: evicted)
            }
            return parsed
        }

        func removeAll() {
            lock.lock()
            defer { lock.unlock() }
            entries.removeAll()
            order.removeAll()
        }
    }

    extension AvatuneColor {
        /// Packed `0xRRGGBBAA`, used as a cache key rather than for drawing.
        ///
        /// Two colours that round to the same bytes produce the same artwork, so
        /// keying on the rounded form is what makes near-identical colours share
        /// a cache entry.
        var packed: UInt32 {
            func byte(_ value: Double) -> UInt32 {
                UInt32(max(0, min(255, (value + 0.5).rounded(.down))))
            }
            return byte(red) << 24 | byte(green) << 16 | byte(blue) << 8
                | byte(alpha * 255)
        }
    }

#endif
