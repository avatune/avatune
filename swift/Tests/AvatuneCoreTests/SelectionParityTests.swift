import XCTest

@testable import AvatuneCore

/// Verifies that the Swift selector picks the same items and colours as
/// `selectItems` for every theme, seed and configuration in the fixture.
final class SelectionParityTests: XCTestCase {
    private static var fixture: Result<SelectionFixture, Error>!

    override class func setUp() {
        super.setUp()
        fixture = Fixtures.cached(SelectionFixture.self, named: "selection")
    }

    private func requireFixture() throws -> SelectionFixture {
        try XCTUnwrap(Self.fixture, "suite setUp did not run").get()
    }

    func testSelectionMatchesJavaScript() throws {
        let fixture = try requireFixture()
        let themes = try Dictionary(
            uniqueKeysWithValues: fixture.themes.map { ($0.name, try $0.makeTheme()) }
        )

        var failures: [String] = []
        var checked = 0

        for testCase in fixture.cases {
            guard let theme = themes[testCase.theme] else {
                failures.append("\(testCase.theme): no theme in fixture")
                continue
            }
            checked += 1

            let result = ItemSelector.select(
                configuration: testCase.config,
                theme: theme,
                predictions: testCase.predictions
            )
            let where_ = "\(testCase.theme)/\(testCase.label)"

            let actualIdentifiers = Dictionary(
                uniqueKeysWithValues: result.identifiers.map { ($0.key.rawValue, $0.value) }
            )
            if actualIdentifiers != testCase.expect.identifiers {
                for key in Set(actualIdentifiers.keys).union(testCase.expect.identifiers.keys)
                    .sorted()
                {
                    let actual = actualIdentifiers[key] ?? "<none>"
                    let expected = testCase.expect.identifiers[key] ?? "<none>"
                    if actual != expected {
                        failures.append("\(where_) identifier[\(key)]: \(actual) != \(expected)")
                    }
                }
            }

            for (key, expectedHex) in testCase.expect.colors {
                guard let category = AvatarPartCategory(rawValue: key) else { continue }
                let expected = AvatuneColor(hex: expectedHex)
                if result.colors[category] != expected {
                    let actual = result.colors[category]?.hexString ?? "<none>"
                    failures.append(
                        "\(where_) colour[\(key)]: \(actual) != \(expectedHex.lowercased())")
                }
            }

            // The background is chosen outside the per-category loop, so a bug
            // there is invisible to the colour comparison above.
            let expectedBackground = testCase.expect.style.backgroundColor.flatMap(
                AvatuneColor.init(hex:))
            if result.backgroundColor != expectedBackground {
                failures.append(
                    "\(where_) background: \(result.backgroundColor?.hexString ?? "<none>") != "
                        + "\(expectedBackground?.hexString ?? "<none>")")
            }

            if result.cornerRadius != testCase.expect.style.borderRadius {
                failures.append(
                    "\(where_) cornerRadius: \(String(describing: result.cornerRadius)) != "
                        + "\(String(describing: testCase.expect.style.borderRadius))")
            }

            let extraColors = Set(result.colors.keys.map(\.rawValue))
                .subtracting(testCase.expect.colors.keys)
            for key in extraColors.sorted() {
                failures.append("\(where_) colour[\(key)]: assigned but JavaScript assigned none")
            }
        }

        XCTAssertGreaterThan(checked, 0, "fixture contained no runnable cases")
        XCTAssertTrue(
            failures.isEmpty,
            """
            \(failures.count) selection divergences over \(checked) case(s).
            First 15:
            \(failures.prefix(15).joined(separator: "\n"))
            """
        )
    }

    /// A theme may declare a palette for a category it has no artwork for.
    /// That category takes no item but still receives a colour, so the selector
    /// has to walk palette order rather than the item collections.
    func testCategoryWithoutItemsStillReceivesAColour() throws {
        let fixture = try requireFixture()
        let raw = try XCTUnwrap(
            fixture.themes.first { $0.name == "fatin-verse" },
            "fatin-verse should be present"
        )
        let emptyCategory = try XCTUnwrap(
            raw.categories.first { $0.items.isEmpty },
            "fatin-verse should declare a palette entry with no items"
        )
        let category = try XCTUnwrap(AvatarPartCategory(rawValue: emptyCategory.category))

        let result = ItemSelector.select(
            configuration: AvatarConfiguration(seed: "parity"),
            theme: try raw.makeTheme()
        )

        XCTAssertNil(result.identifiers[category])
        XCTAssertNotNil(result.colors[category])
    }

    /// Themes give different categories the same layer on purpose, relying on
    /// declaration order to break the tie, so the draw ordering must be stable.
    func testDrawOrderIsStableAcrossEqualLayers() throws {
        let fixture = try requireFixture()

        for raw in fixture.themes {
            let theme = try raw.makeTheme()
            let result = ItemSelector.select(
                configuration: AvatarConfiguration(seed: "layers"),
                theme: theme
            )

            let layers = result.drawOrder.map(\.item.layer)
            XCTAssertEqual(layers, layers.sorted(), "\(raw.name): draw order is not by layer")

            let rank = Dictionary(
                uniqueKeysWithValues: theme.categories.enumerated().map { ($1.category, $0) }
            )
            for (previous, next) in zip(result.drawOrder, result.drawOrder.dropFirst())
            where previous.item.layer == next.item.layer {
                XCTAssertLessThan(
                    rank[previous.category] ?? 0,
                    rank[next.category] ?? 0,
                    "\(raw.name): equal layers lost declaration order"
                )
            }
        }
    }
}
