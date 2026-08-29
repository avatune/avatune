import XCTest

@testable import AvatuneCore

/// Verifies the colord port against values produced by the real library.
///
/// This is the suite most worth keeping green. A colour port written from the
/// standard HSL formulas rather than colord's HSV-mediated ones renders every
/// theme successfully and slightly wrongly, which no visual threshold catches
/// cleanly and no stack trace points at.
final class ColordParityTests: XCTestCase {
    private static var fixture: Result<ColorFixture, Error>!

    override class func setUp() {
        super.setUp()
        fixture = Fixtures.cached(ColorFixture.self, named: "colors")
    }

    private func requireFixture() throws -> ColorFixture {
        try XCTUnwrap(Self.fixture, "suite setUp did not run").get()
    }

    /// Round-trips every fixture colour through parsing and formatting, so a
    /// later failure is known to be arithmetic rather than I/O.
    func testHexRoundTrip() throws {
        let fixture = try requireFixture()

        for conversion in fixture.conversions {
            let color = try XCTUnwrap(
                AvatuneColor(hex: conversion.input), "cannot parse \(conversion.input)")
            XCTAssertEqual(color.hexString, conversion.hex, "round-tripping \(conversion.input)")
        }
    }

    /// Pins the RGB/HSL boundary itself, so a broken conversion fails here
    /// rather than several layers up inside a chain.
    ///
    /// The fixture records colord's public `toHsl()`, which rounds each
    /// component to a whole number. The internal conversion the operations use
    /// does not round — that is exactly why a chain must not round between its
    /// steps — so the rounding is applied here rather than in the port.
    func testHslConversion() throws {
        let fixture = try requireFixture()

        for conversion in fixture.conversions {
            let color = try XCTUnwrap(AvatuneColor(hex: conversion.input))
            let hsl = Colord.rgbaToHsla(color)

            XCTAssertEqual(
                Colord.round(hsl.h), conversion.hsl.h, "hue of \(conversion.input)")
            XCTAssertEqual(
                Colord.round(hsl.s), conversion.hsl.s, "saturation of \(conversion.input)")
            XCTAssertEqual(
                Colord.round(hsl.l), conversion.hsl.l, "lightness of \(conversion.input)")
            XCTAssertEqual(
                Colord.hue(of: color), conversion.hue, "rounded hue of \(conversion.input)")
        }
    }

    /// Every operation chain the asset packages can produce, plus single-op
    /// sweeps, applied to every palette colour in the repo.
    func testOperationChains() throws {
        let fixture = try requireFixture()

        var failures: [String] = []
        for row in fixture.rows {
            let input = fixture.inputs[row.inputIndex]
            let chain = fixture.chains[row.chainIndex]

            guard let color = AvatuneColor(hex: input) else {
                failures.append("cannot parse input \(input)")
                continue
            }

            let actual = Colord.apply(chain.ops, to: color).hexString
            if actual != row.expected {
                failures.append("\(chain.id) on \(input): got \(actual), expected \(row.expected)")
            }
        }

        XCTAssertTrue(
            failures.isEmpty,
            """
            \(failures.count) of \(fixture.rows.count) colour operations diverge from colord.
            First 10:
            \(failures.prefix(10).joined(separator: "\n"))
            """
        )
    }

    /// colord normalises a hue of 0 to 360. It is invisible in isolation but
    /// changes the result of a rotation, so it is asserted directly.
    func testHueZeroNormalisesTo360() {
        XCTAssertEqual(Colord.normalizeHue(0), 360)
        XCTAssertEqual(Colord.normalizeHue(360), 360)
        XCTAssertEqual(Colord.normalizeHue(-34), 326)
        XCTAssertEqual(Colord.normalizeHue(400), 40)
    }

    /// JavaScript's `Math.round` rounds halves towards positive infinity, where
    /// Swift's `rounded()` rounds away from zero.
    func testJavaScriptRounding() {
        XCTAssertEqual(Colord.round(0.5), 1)
        XCTAssertEqual(Colord.round(1.5), 2)
        XCTAssertEqual(Colord.round(2.5), 3)
        XCTAssertEqual(Colord.round(-0.5), 0)
        XCTAssertEqual(Colord.round(-1.5), -1)
    }
}
