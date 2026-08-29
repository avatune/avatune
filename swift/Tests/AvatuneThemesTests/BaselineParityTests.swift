#if canImport(CoreGraphics)

    import AvatuneAllThemes
    import AvatuneCore
    import AvatuneRender
    import CoreGraphics
    import ImageIO
    import XCTest

    #if canImport(UniformTypeIdentifiers)
        import UniformTypeIdentifiers
    #endif

    /// Compares rendered avatars against the web renderer's own PNGs.
    ///
    /// The full 400-avatar run lives in `tests/swift` and needs a Mac, a Swift
    /// toolchain and the JavaScript repository. This is the portable subset: one
    /// avatar per theme, bundled with the package, so it runs anywhere
    /// `swift test` does — including the iOS simulator, which is the platform the
    /// macOS suite cannot speak for, and inside the mirrored repository, which
    /// does not contain the JavaScript side at all.
    final class BaselineParityTests: XCTestCase {
        private struct Fixture: Decodable {
            struct Row: Decodable {
                let theme: String
                let seed: String
                let file: String
                let size: Double
            }
            let rows: [Row]
        }

        /// Matches `tests/swift/src/thresholds.ts`. Two rasterisers never agree on
        /// antialiasing, and an avatar is mostly edges.
        private let channelTolerance = 32.0
        private let maxDifferingPercent = 2.0
        private let maxMeanError = 3.0

        private func loadBaseline(_ file: String) -> CGImage? {
            guard
                let url = Bundle.module.url(
                    forResource: "Baselines/\(file.replacingOccurrences(of: ".png", with: ""))",
                    withExtension: "png"
                )
                    ?? Bundle.module.url(
                        forResource: file.replacingOccurrences(of: ".png", with: ""),
                        withExtension: "png"
                    ),
                let source = CGImageSourceCreateWithURL(url as CFURL, nil)
            else { return nil }
            return CGImageSourceCreateImageAtIndex(source, 0, nil)
        }

        /// Flattened over white, so a difference in transparency shows up as a
        /// colour difference rather than being ignored.
        private func flattened(_ image: CGImage, side: Int) -> [UInt8]? {
            var buffer = [UInt8](repeating: 255, count: side * side * 4)
            guard
                let context = CGContext(
                    data: &buffer,
                    width: side,
                    height: side,
                    bitsPerComponent: 8,
                    bytesPerRow: side * 4,
                    space: CGColorSpaceCreateDeviceRGB(),
                    bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
                )
            else { return nil }

            context.setFillColor(
                CGColor(
                    colorSpace: CGColorSpaceCreateDeviceRGB(), components: [1, 1, 1, 1]
                ) ?? CGColor(gray: 1, alpha: 1)
            )
            context.fill(CGRect(x: 0, y: 0, width: side, height: side))
            context.draw(image, in: CGRect(x: 0, y: 0, width: side, height: side))
            return buffer
        }

        func testEveryThemeMatchesItsBaseline() throws {
            guard let url = Bundle.module.url(forResource: "baselines", withExtension: "json")
            else {
                throw XCTSkip(
                    "baselines.json is missing. Run 'bun run build && bun scripts/generate-swift.ts'."
                )
            }
            let fixture = try JSONDecoder().decode(Fixture.self, from: Data(contentsOf: url))
            try XCTSkipIf(fixture.rows.isEmpty, "no bundled baselines")

            var failures: [String] = []

            for row in fixture.rows {
                guard let theme = allThemes[row.theme] else {
                    failures.append("\(row.theme): not in registry")
                    continue
                }
                guard let baseline = loadBaseline(row.file) else {
                    failures.append("\(row.theme): baseline \(row.file) not bundled")
                    continue
                }

                let avatar = ResolvedAvatar(theme: theme, seed: .string(row.seed))
                guard
                    let rendered = AvatarImageRenderer.cgImage(avatar, size: row.size, scale: 1),
                    let expected = flattened(baseline, side: Int(row.size)),
                    let actual = flattened(rendered, side: Int(row.size))
                else {
                    failures.append("\(row.theme): could not rasterise")
                    continue
                }

                let pixels = expected.count / 4
                var differing = 0
                var total = 0.0

                for index in 0..<pixels {
                    let offset = index * 4
                    var worst = 0.0
                    var sum = 0.0
                    for channel in 0..<3 {
                        let delta = abs(
                            Double(expected[offset + channel]) - Double(actual[offset + channel]))
                        worst = max(worst, delta)
                        sum += delta
                    }
                    total += sum / 3
                    if worst > channelTolerance { differing += 1 }
                }

                let differingPercent = Double(differing) / Double(pixels) * 100
                let meanError = total / Double(pixels)

                if differingPercent > maxDifferingPercent || meanError > maxMeanError {
                    failures.append(
                        String(
                            format: "%@: %.2f%% differing, %.2f mean error",
                            row.theme, differingPercent, meanError))
                }
            }

            XCTAssertTrue(
                failures.isEmpty,
                """
                \(failures.count) of \(fixture.rows.count) theme(s) diverge from the web renderer:
                \(failures.joined(separator: "\n"))
                """
            )
        }
    }

#endif
