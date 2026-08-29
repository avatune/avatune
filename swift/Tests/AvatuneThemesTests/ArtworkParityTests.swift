import AvatuneAllThemes
import XCTest

@testable import AvatuneCore

/// Verifies the generated theme modules against the artwork fixture.
///
/// The theme modules carry roughly two megabytes of SVG as raw string literals.
/// The risk there is transcription rather than logic — a raw-literal fence the
/// content can close early, a lost escape, segments joined in the wrong order —
/// and every one of those produces Swift that compiles cleanly and draws the
/// wrong thing. Comparing rebuilt SVG against what the JavaScript produced is
/// the only way to see it.
final class ArtworkParityTests: XCTestCase {
    private static var fixture: Result<ArtworkFixture, Error>!

    override class func setUp() {
        super.setUp()
        fixture = Fixtures.cached(ArtworkFixture.self, named: "artwork")
    }

    private func requireFixture() throws -> ArtworkFixture {
        try XCTUnwrap(Self.fixture, "suite setUp did not run").get()
    }

    private func color(_ fixture: ArtworkFixture) throws -> AvatuneColor {
        try XCTUnwrap(AvatuneColor(hex: fixture.color))
    }

    private func item(
        _ theme: AvatuneTheme,
        _ category: String,
        _ key: String
    ) -> ItemDescriptor? {
        guard let parsed = AvatarPartCategory(rawValue: category) else { return nil }
        return theme.categories.first { $0.category == parsed }?.items.first { $0.key == key }
    }

    /// Every theme the generator produced is reachable, so a new theme cannot
    /// be added and silently skipped by the rest of this suite.
    func testRegistryCoversEveryFixtureTheme() throws {
        let fixture = try requireFixture()
        let named = Set(fixture.rows.map(\.theme))

        for theme in named {
            XCTAssertNotNil(allThemes[theme], "theme '\(theme)' is missing from the registry")
        }
        XCTAssertEqual(Set(allThemes.keys), named)
    }

    func testEveryItemRebuildsItsArtwork() throws {
        let fixture = try requireFixture()
        let color = try color(fixture)

        var failures: [String] = []
        var checked = 0

        for row in fixture.rows {
            guard let theme = allThemes[row.theme] else {
                failures.append("\(row.theme): not in registry")
                continue
            }
            guard let item = item(theme, row.category, row.key) else {
                failures.append("\(row.theme)/\(row.category).\(row.key): not in theme")
                continue
            }

            let where_ = "\(row.theme)/\(row.category).\(row.key)"
            guard item.fragments.count == row.fragments.count else {
                failures.append(
                    "\(where_): \(item.fragments.count) fragment(s), expected \(row.fragments.count)")
                continue
            }

            for (index, expected) in row.fragments.enumerated() {
                checked += 1
                let svg = item.fragments[index].svg(color: color)

                if svg.count != expected.length {
                    failures.append(
                        "\(where_) fragment \(index): length \(svg.count), expected \(expected.length)"
                    )
                    continue
                }
                let hash = avatuneHashString(svg)
                if hash != expected.hash {
                    failures.append(
                        "\(where_) fragment \(index): hash \(hash), expected \(expected.hash)")
                }
            }
        }

        XCTAssertGreaterThan(checked, 0, "fixture contained no fragments")
        XCTAssertTrue(
            failures.isEmpty,
            """
            \(failures.count) of \(checked) fragment(s) do not match the generated artwork.
            First 10:
            \(failures.prefix(10).joined(separator: "\n"))
            """
        )
    }

    /// Full-text comparison for the shapes most likely to break transcription:
    /// multi-fragment items, items carrying an effect, and items whose SVG holds
    /// the quote-hash sequence that closes a raw string literal early.
    func testSampledItemsMatchExactly() throws {
        let fixture = try requireFixture()
        let color = try color(fixture)

        for sample in fixture.samples {
            guard let theme = allThemes[sample.theme],
                let item = item(theme, sample.category, sample.key)
            else {
                XCTFail("\(sample.theme)/\(sample.category).\(sample.key) is missing")
                continue
            }

            let where_ = "\(sample.theme)/\(sample.category).\(sample.key) (\(sample.why))"
            XCTAssertEqual(item.fragments.count, sample.svgs.count, where_)

            for (index, expected) in sample.svgs.enumerated() where index < item.fragments.count {
                XCTAssertEqual(
                    item.fragments[index].svg(color: color),
                    expected,
                    "\(where_) fragment \(index)"
                )
            }
        }
    }

    /// Positions, layers and viewports come from the same IR as the artwork, so
    /// a mis-emitted number would otherwise only show up as a misplaced item in
    /// a rendered avatar.
    func testItemGeometryIsPopulated() throws {
        let fixture = try requireFixture()

        for row in fixture.rows {
            guard let theme = allThemes[row.theme],
                let item = item(theme, row.category, row.key)
            else { continue }

            XCTAssertGreaterThan(
                item.width, 0, "\(row.theme)/\(row.category).\(row.key) has no width")
            XCTAssertGreaterThan(
                item.height, 0, "\(row.theme)/\(row.category).\(row.key) has no height")

            let resolved = item.position.resolved(for: theme.style.size)
            XCTAssertTrue(
                resolved.x.isFinite && resolved.y.isFinite,
                "\(row.theme)/\(row.category).\(row.key) has a non-finite position"
            )
        }
    }
}
