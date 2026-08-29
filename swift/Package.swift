// swift-tools-version: 5.9
import PackageDescription

// AUTO-GENERATED THEMES BEGIN
let themes = ["AshleySeo", "Ashleyy", "Cyberpunk", "FatinVerse", "Kyute", "Micah", "Miniavs", "Nevmstas", "Orks", "Pacovqzz", "PawelOlekMan", "PawelOlekWoman", "RetroCartoon", "ToonFlat", "VampireSkin", "Yanliu"]
// AUTO-GENERATED THEMES END

// AvatuneCore is deliberately free of CoreGraphics so that theme data modules
// can never reach for a drawing API, and so the parity suites compile and run
// on Linux. Rendering lands in a separate AvatuneRender target.
let package = Package(
    name: "Avatune",
    platforms: [
        .iOS(.v15),
        .macOS(.v12),
        .tvOS(.v15),
        .watchOS(.v8),
        .visionOS(.v1),
    ],
    products: [
        .library(name: "AvatuneCore", targets: ["AvatuneCore"]),
        .library(name: "AvatuneRender", targets: ["AvatuneRender"]),
    ]
        + themes.map {
            // A theme product carries the renderer so a consumer adds one
            // dependency, while the theme *target* still depends on Core alone.
            .library(name: "Avatune\($0)", targets: ["Avatune\($0)", "AvatuneRender"])
        },
    dependencies: [
        .package(url: "https://github.com/swhitty/SwiftDraw.git", exact: "0.29.0")
    ],
    targets: [
        .target(name: "AvatuneCore"),
        .target(
            name: "AvatuneRender",
            dependencies: [
                "AvatuneCore",
                // Conditional: SwiftDraw imports CoreGraphics unguarded in a few
                // files, so it cannot build on Linux. Everything in this target
                // is behind `#if canImport(CoreGraphics)` anyway, so the module
                // compiles to nothing there and AvatuneCore stays usable
                // server-side without pulling a drawing stack.
                .product(
                    name: "SwiftDraw",
                    package: "SwiftDraw",
                    condition: .when(platforms: [.macOS, .iOS, .tvOS, .watchOS, .visionOS])
                ),
            ]
        ),
        // Not a product: nothing a consumer can import pulls in every theme.
        .target(
            name: "AvatuneAllThemes",
            dependencies: ["AvatuneCore"] + themes.map { .target(name: "Avatune\($0)") }
        ),
        .executableTarget(
            name: "AvatuneSnapshot",
            dependencies: ["AvatuneCore", "AvatuneRender", "AvatuneAllThemes"],
            path: "Tools/AvatuneSnapshot"
        ),
        .executableTarget(
            name: "Avatune",
            dependencies: ["AvatuneCore", "AvatuneRender", "AvatuneAllThemes"],
            path: "Tools/Avatune"
        ),
        .testTarget(
            name: "AvatuneCoreTests",
            dependencies: ["AvatuneCore"],
            resources: [.process("Fixtures")]
        ),
        // Separate from AvatuneCoreTests so the pure-Swift suites do not depend
        // on generated data to run.
        .testTarget(
            name: "AvatuneThemesTests",
            dependencies: ["AvatuneCore", "AvatuneRender", "AvatuneAllThemes", "AvatuneKyute"],
            resources: [.process("Fixtures")]
        ),
    ]
        + themes.map {
            // Theme data depends on Core only, so it can never reference a
            // drawing API and still compiles on Linux.
            .target(name: "Avatune\($0)", dependencies: ["AvatuneCore"])
        }
)
