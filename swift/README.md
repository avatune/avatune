# Avatune for Swift

Native avatar rendering for Apple platforms, generated from the same theme
packages the web renderers use.

```swift
import AvatuneRender
import AvatuneKyute

AvatarView(.kyute, seed: .string(user.id))
    .frame(width: 96, height: 96)
```

Each theme also ships a typed builder. A theme only has methods for the
categories it actually defines, so `kyute` has no `hats(_:)` and a wrong
identifier fails to compile rather than falling back to seeded selection:

```swift
AvatarView(
    KyuteAvatar(seed: .string(user.id))
        .hair(.bob, color: .hex(0xFF5733))
        .body(.tshirt)
        .background(.hex(0x202020))
)

// UIKit and AppKit
imageView.image = AvatarImageRenderer.image(avatar, size: 96)

// Any layer-backed view
view.layer.addSublayer(AvatarLayer(KyuteAvatar(seed: "alice")))
```

Avatars can also be rasterised or exported as a vector:

```swift
let avatar = ResolvedAvatar(theme: .kyute, seed: .string(user.id))
let image = AvatarImageRenderer.image(avatar, size: 96)
let markup = avatar.svg(size: 512)   // pure Swift, no drawing stack
```

## Package layout

| Target | What it is |
| --- | --- |
| `AvatuneCore` | Selection, colour maths and theme model. Pure Swift — no CoreGraphics, no dependencies, compiles on Linux. |
| `AvatuneRender` | Drawing: CoreGraphics, SwiftUI `AvatarView`, `AvatarImageRenderer`. Depends on [SwiftDraw](https://github.com/swhitty/SwiftDraw). |
| `Avatune<Theme>` | Generated theme data, one module per theme. Depends on `AvatuneCore` only. |

A theme *product* bundles `AvatuneRender`, so a consumer adds one dependency and
pays for one theme.

## Generated code

Everything under `Sources/Avatune<Theme>/` is generated and committed. Do not
edit it by hand:

```sh
bun run build                    # theme dist/ is the generator's input
bun scripts/generate-swift.ts
```

The generator is deterministic: running it twice writes nothing the second time.
If it produces a diff you did not expect, something in the theme packages
changed.

## Avatune, the browser app

The equivalent of the per-framework storybooks:

```sh
swift run -c release Avatune
```

Three columns — themes on the left, a grid of seeded avatars in the middle, and
an inspector on the right where any category's item and colour can be overridden.
Click an avatar to load it into the inspector, then save it as a 1024px PNG or as
SVG. Needs macOS 13 or later.

Build it in release: in debug the SVG parser is slow enough that scrolling a grid
of avatars feels sluggish.

## Tests

```sh
swift test                       # selection, colour and artwork parity
```

These compare against fixtures generated from the JavaScript implementation, so
a failure means the Swift port diverges from shipped behaviour. They include one
bundled reference image per theme, so the package verifies itself against the web
renderer without needing the JavaScript repository.

The same suite runs on the simulator, which is the only way to exercise the UIKit
paths:

```sh
xcodebuild test -scheme Avatune -destination 'platform=iOS Simulator,name=iPhone 17 Pro'
```

**Visual parity runs separately, and only on a Mac:**

```sh
bun run --cwd tests/swift test
```

It renders every theme and seed and diffs against the PNG baselines committed
for `@avatune/vanilla`. CoreGraphics and librsvg never agree pixel-for-pixel, so
the comparison uses the thresholds in `tests/swift/src/thresholds.ts`; the
observed worst case is well inside them. Set `KEEP_SWIFT_DIFFS=1` to keep the
rendered output and side-by-side diff images in `tests/swift/.tmp`.

Run this before releasing. The ubuntu CI job covers the numeric suites but has
no CoreGraphics.

## Requirements

Swift 6.0 or later to build — SwiftDraw's manifest declares
`swift-tools-version: 6.0`. Deployment targets are iOS 15, macOS 12, tvOS 15,
watchOS 8 and visionOS 1, set by SwiftUI's `Canvas`.

## Releasing

The package is consumed from a standalone mirror, because SPM resolves a package
from a repository root and this one lives in a subdirectory:

```swift
.package(url: "https://github.com/avatune/avatune-swift", from: "0.1.0")
```

`swift/package.json` exists only so changesets can version this package alongside
the npm ones — it is never published. Because it depends on every theme,
`updateInternalDependencies: "patch"` means a theme release cascades a patch
here, and `.github/workflows/release-swift.yml` mirrors `swift/` and tags it.

The workflow is idempotent: it exits without doing anything if the version's tag
already exists, so a push that only regenerates sources will not move a tag
consumers have already resolved.

`branch:` dependencies on the mirror are unsupported — its `main` is a synthetic
history rebuilt on each release. Depend on a tag.
