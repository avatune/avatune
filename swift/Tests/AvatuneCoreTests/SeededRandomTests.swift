import XCTest

@testable import AvatuneCore

/// Verifies the hashing and pseudo-random generator against JavaScript.
final class SeededRandomTests: XCTestCase {
    private static var fixture: Result<RandomFixture, Error>!

    override class func setUp() {
        super.setUp()
        fixture = Fixtures.cached(RandomFixture.self, named: "random")
    }

    private func requireFixture() throws -> RandomFixture {
        try XCTUnwrap(Self.fixture, "suite setUp did not run").get()
    }

    func testHashMatchesJavaScript() throws {
        let fixture = try requireFixture()

        var failures: [String] = []
        for row in fixture.rows {
            let actual = avatuneHashString(row.input)
            if actual != row.hash {
                let label = row.note.map { " (\($0))" } ?? ""
                failures.append(
                    "\(String(reflecting: row.input))\(label): got \(actual), expected \(row.hash)")
            }
        }

        XCTAssertTrue(
            failures.isEmpty,
            """
            \(failures.count) of \(fixture.rows.count) hashes diverge.
            First 10:
            \(failures.prefix(10).joined(separator: "\n"))
            """
        )
    }

    func testGeneratorSequenceMatchesJavaScript() throws {
        let fixture = try requireFixture()

        var failures: [String] = []
        for row in fixture.rows {
            var generator = SeededRandom(seed: row.input)
            for (index, expected) in row.values.enumerated() {
                let actual = generator.next()
                if abs(actual - expected) > 1e-15 {
                    failures.append(
                        "\(String(reflecting: row.input)) draw \(index): got \(actual), expected \(expected)"
                    )
                }
            }
        }

        XCTAssertTrue(
            failures.isEmpty,
            """
            \(failures.count) generator draws diverge.
            First 10:
            \(failures.prefix(10).joined(separator: "\n"))
            """
        )
    }

    /// A string hashing to `Int32.min` makes JavaScript's `Math.abs` produce
    /// 2147483648, which is not an `Int32`. Taking the absolute value before
    /// widening would trap here rather than return the right number.
    func testHashWidensBeforeAbsoluteValue() throws {
        let fixture = try requireFixture()
        let row = try XCTUnwrap(
            fixture.rows.first { $0.input == "ysoa29udd蓢" },
            "fixture should carry the Int32.min hash case"
        )

        XCTAssertEqual(row.hash, 2_147_483_648)
        XCTAssertEqual(avatuneHashString(row.input), 2_147_483_648)
        XCTAssertGreaterThan(row.hash, Int64(Int32.max))
    }

    /// `charCodeAt` walks UTF-16 code units, so a scalar-based port would
    /// produce different hashes for anything outside the basic plane.
    func testHashUsesUTF16CodeUnits() {
        let rocket = "🚀"
        XCTAssertEqual(rocket.unicodeScalars.count, 1)
        XCTAssertEqual(rocket.utf16.count, 2)

        var expected: Int32 = 0
        for unit in rocket.utf16 {
            expected = Int32(truncatingIfNeeded: Int64(expected &<< 5) - Int64(expected) + Int64(unit))
        }
        XCTAssertEqual(avatuneHashString(rocket), abs(Int64(expected)))
    }

    func testNumericSeedFormatting() throws {
        let fixture = try requireFixture()

        for row in fixture.numbers {
            // Exponent-notation thresholds differ between the two languages;
            // seeds in that range are documented as unsupported.
            guard abs(row.value) < 1e21, abs(row.value) > 1e-7 || row.value == 0 else { continue }
            XCTAssertEqual(
                AvatuneSeed.number(row.value).text,
                row.text,
                "formatting \(row.value)\(row.note.map { " (\($0))" } ?? "")"
            )
        }
    }
}
