#if canImport(AppKit)

    import AvatuneAllThemes
    import AvatuneCore
    import AvatuneRender
    import SwiftUI
    import UniformTypeIdentifiers

    /// Browses every generated theme.
    ///
    /// Three columns, which is the shape macOS users already know from Mail and
    /// Notes: pick a theme, scan its avatars, inspect one. `NavigationSplitView`
    /// collapses columns on its own as the window narrows, so the layout holds at
    /// any width without hand-written breakpoints.
    @available(macOS 13.0, *)
    struct BrowserView: View {
        @State private var themeName: String = allThemes.keys.sorted().first ?? ""
        @State private var seed: String = "alice.wonder@example.com"
        @State private var tileSize: Double = 92
        @State private var overrides: [AvatarPartCategory: String] = [:]
        @State private var colorOverrides: [AvatarPartCategory: AvatuneColor] = [:]
        @State private var search: String = ""

        private var themeNames: [String] { allThemes.keys.sorted() }
        private var theme: AvatuneTheme? { allThemes[themeName] }

        private var visibleThemes: [String] {
            guard !search.isEmpty else { return themeNames }
            return themeNames.filter { $0.localizedCaseInsensitiveContains(search) }
        }

        var body: some View {
            NavigationSplitView {
                sidebar
            } content: {
                gallery
            } detail: {
                inspector
            }
            .navigationSplitViewStyle(.balanced)
        }

        // MARK: - Themes

        private var sidebar: some View {
            List(visibleThemes, id: \.self, selection: selectedTheme) { name in
                if let entry = allThemes[name] {
                    // An HStack rather than a Label: Label aligns its icon to the
                    // first text baseline, which sits it high against a two-line
                    // stack. HStack centres on the whole row.
                    HStack(spacing: 10) {
                        AvatarView(entry, seed: .string("preview"))
                            .frame(width: 28, height: 28)

                        VStack(alignment: .leading, spacing: 1) {
                            Text(displayName(name))
                            Text("^[\(itemCount(entry)) item](inflect: true)")
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }
                    }
                    .padding(.vertical, 2)
                    .tag(name)
                }
            }
            .searchable(text: $search, placement: .sidebar, prompt: "Filter themes")
            .navigationTitle("Themes")
            .navigationSplitViewColumnWidth(min: 200, ideal: 232, max: 300)
        }

        /// Keeps the sidebar selection non-optional: clicking away should not
        /// leave the other two columns with nothing to show.
        private var selectedTheme: Binding<String?> {
            Binding(
                get: { themeName },
                set: { newValue in
                    guard let newValue, newValue != themeName else { return }
                    themeName = newValue
                    // Item keys are per-theme, so a carried-over override would
                    // silently miss and fall back to seeded selection.
                    overrides.removeAll()
                    colorOverrides.removeAll()
                }
            )
        }

        // MARK: - Gallery

        /// Deterministic, so the grid is identical on every launch and can be
        /// compared against a previous run by eye.
        private var gallerySeeds: [String] { (0..<60).map { "avatune-\($0)" } }

        private var gallery: some View {
            ScrollView {
                LazyVGrid(
                    columns: [GridItem(.adaptive(minimum: tileSize), spacing: 14)],
                    spacing: 14
                ) {
                    ForEach(gallerySeeds, id: \.self) { gallerySeed in
                        if let theme {
                            Button {
                                seed = gallerySeed
                                overrides.removeAll()
                                colorOverrides.removeAll()
                            } label: {
                                AvatarView(theme, seed: .string(gallerySeed))
                                    .frame(width: tileSize, height: tileSize)
                                    .overlay {
                                        RoundedRectangle(cornerRadius: 10)
                                            .strokeBorder(
                                                seed == gallerySeed
                                                    ? Color.accentColor : .clear,
                                                lineWidth: 3
                                            )
                                            .padding(-4)
                                    }
                            }
                            .buttonStyle(.plain)
                            .help(gallerySeed)
                        }
                    }
                }
                .padding(20)
            }
            .background(.background)
            // The content column drives the window title on macOS. The app keeps
            // the title and the theme becomes the subtitle, so the window says
            // what it is before it says what it is showing.
            .navigationTitle("Avatune")
            .navigationSubtitle(
                theme.map { "\(displayName($0.name)) · \(gallerySeeds.count) seeds" } ?? ""
            )
            .toolbar {
                ToolbarItem {
                    // No min/max value labels: a decorated slider does not size
                    // to a toolbar item, and the larger glyph spills outside it.
                    Slider(value: $tileSize, in: 56...160)
                        .controlSize(.small)
                        .frame(width: 120)
                        .help("Avatar size")
                        .accessibilityLabel("Avatar size")
                }
            }
            .navigationSplitViewColumnWidth(min: 280, ideal: 560)
        }

        // MARK: - Inspector

        private var inspector: some View {
            Form {
                if let theme {
                    Section {
                        VStack(spacing: 12) {
                            AvatarView(resolved(theme))
                                .frame(width: 200, height: 200)

                            HStack(spacing: 10) {
                                Button {
                                    export(theme, as: .png)
                                } label: {
                                    Label("PNG", systemImage: "arrow.down.circle")
                                        .frame(maxWidth: .infinity)
                                }
                                .help("Save a \(Int(exportSize))×\(Int(exportSize)) bitmap")

                                Button {
                                    export(theme, as: .svg)
                                } label: {
                                    Label("SVG", systemImage: "arrow.down.circle")
                                        .frame(maxWidth: .infinity)
                                }
                                .help("Save a scalable vector")
                            }
                            .controlSize(.large)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 4)
                    }

                    Section("Seed") {
                        TextField("Seed", text: $seed, prompt: Text("any string"))
                            .textFieldStyle(.roundedBorder)
                            .labelsHidden()

                        Button {
                            seed = "avatune-\(Int.random(in: 0..<100_000))"
                        } label: {
                            Label("Randomise", systemImage: "dice")
                        }
                    }

                    Section("Parts") {
                        ForEach(theme.categories.filter { !$0.items.isEmpty }, id: \.category) {
                            categoryRow($0)
                        }
                    }

                    Section {
                        Button("Reset overrides", role: .destructive) {
                            overrides.removeAll()
                            colorOverrides.removeAll()
                        }
                        .disabled(overrides.isEmpty && colorOverrides.isEmpty)
                    } footer: {
                        Text(overrideSummary)
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                }
            }
            // Grouped form styling is what aligns every label into one column;
            // laying these out by hand is what made the controls look ragged.
            .formStyle(.grouped)
            .navigationSplitViewColumnWidth(min: 280, ideal: 320, max: 400)
        }

        private func categoryRow(_ category: AvatuneTheme.Category) -> some View {
            LabeledContent(displayName(category.category.rawValue)) {
                HStack(spacing: 8) {
                    Picker("", selection: itemBinding(for: category.category)) {
                        Text("Seeded").tag("")
                        Divider()
                        ForEach(category.items, id: \.key) { item in
                            Text(displayName(item.key)).tag(item.key)
                        }
                    }
                    .labelsHidden()
                    .frame(maxWidth: .infinity)

                    ColorPicker(
                        "",
                        selection: colorBinding(for: category.category, palette: category.palette)
                    )
                    .labelsHidden()
                    .help("Override colour")
                }
            }
        }

        private var overrideSummary: String {
            let parts = overrides.count + colorOverrides.count
            return parts == 0
                ? "Everything is derived from the seed."
                : "\(parts) override\(parts == 1 ? "" : "s") applied."
        }

        // MARK: - Export

        /// Bitmaps export large enough to stay crisp when scaled down; the vector
        /// export carries its own size and does not care.
        private var exportSize: Double { 1024 }

        private enum ExportFormat {
            case png
            case svg

            var contentType: UTType { self == .png ? .png : .svg }
            var fileExtension: String { self == .png ? "png" : "svg" }
        }

        private func export(_ theme: AvatuneTheme, as format: ExportFormat) {
            let panel = NSSavePanel()
            panel.allowedContentTypes = [format.contentType]
            panel.nameFieldStringValue = "\(suggestedName(theme)).\(format.fileExtension)"
            panel.canCreateDirectories = true

            guard panel.runModal() == .OK, let url = panel.url else { return }

            let avatar = resolved(theme)
            let data: Data?

            switch format {
            case .png:
                data = AvatarImageRenderer.cgImage(avatar, size: exportSize, scale: 1)
                    .map(NSBitmapImageRep.init(cgImage:))
                    .flatMap { $0.representation(using: .png, properties: [:]) }
            case .svg:
                data = avatar.svg(size: exportSize).data(using: .utf8)
            }

            guard let data else {
                present(error: "Could not produce \(format.fileExtension.uppercased()) data.")
                return
            }

            do {
                try data.write(to: url)
            } catch {
                present(error: error.localizedDescription)
            }
        }

        /// `kyute-alice-wonder-example-com`, so saved files stay sortable and
        /// shell-friendly regardless of what the seed contains.
        private func suggestedName(_ theme: AvatuneTheme) -> String {
            let slug = seed
                .lowercased()
                .map { $0.isLetter || $0.isNumber ? $0 : "-" }
                .reduce(into: "") { result, character in
                    if character == "-", result.hasSuffix("-") { return }
                    result.append(character)
                }
                .trimmingCharacters(in: CharacterSet(charactersIn: "-"))

            return slug.isEmpty ? theme.name : "\(theme.name)-\(slug)"
        }

        private func present(error message: String) {
            let alert = NSAlert()
            alert.messageText = "Could not save"
            alert.informativeText = message
            alert.alertStyle = .warning
            alert.runModal()
        }

        // MARK: - State

        private func itemBinding(for category: AvatarPartCategory) -> Binding<String> {
            Binding(
                get: { overrides[category] ?? "" },
                set: { overrides[category] = $0.isEmpty ? nil : $0 }
            )
        }

        private func colorBinding(
            for category: AvatarPartCategory,
            palette: [AvatuneColor]
        ) -> Binding<Color> {
            Binding(
                get: {
                    let current =
                        colorOverrides[category]
                        ?? resolvedColors[category]
                        ?? palette.first
                        ?? AvatuneColor(red: 0, green: 0, blue: 0)
                    return Color(current)
                },
                set: { colorOverrides[category] = AvatuneColor($0) }
            )
        }

        private var resolvedColors: [AvatarPartCategory: AvatuneColor] {
            theme.map { resolved($0).colors } ?? [:]
        }

        private func resolved(_ theme: AvatuneTheme) -> ResolvedAvatar {
            var configuration = AvatarConfiguration(seed: .string(seed))
            for (category, key) in overrides {
                configuration[category] = key
            }
            for (category, color) in colorOverrides {
                configuration[color: category] = color
            }
            return ResolvedAvatar(theme: theme, configuration: configuration)
        }

        private func itemCount(_ theme: AvatuneTheme) -> Int {
            theme.categories.reduce(0) { $0 + $1.items.count }
        }

        /// `ashley-seo` and `faceHair` both become `Ashley Seo` / `Face Hair`.
        private func displayName(_ raw: String) -> String {
            var words: [String] = []
            var current = ""
            for character in raw {
                if character == "-" || character == "_" {
                    if !current.isEmpty { words.append(current) }
                    current = ""
                } else if character.isUppercase, !current.isEmpty {
                    words.append(current)
                    current = String(character)
                } else {
                    current.append(character)
                }
            }
            if !current.isEmpty { words.append(current) }
            return words.map(\.capitalized).joined(separator: " ")
        }
    }

    extension Color {
        init(_ color: AvatuneColor) {
            let (red, green, blue, alpha) = color.components
            self.init(.sRGB, red: red, green: green, blue: blue, opacity: alpha)
        }
    }

    extension AvatuneColor {
        /// Best-effort conversion back from a SwiftUI colour, for the picker.
        init(_ color: Color) {
            let native = NSColor(color).usingColorSpace(.deviceRGB) ?? .black
            self.init(
                red: Double(native.redComponent) * 255,
                green: Double(native.greenComponent) * 255,
                blue: Double(native.blueComponent) * 255,
                alpha: Double(native.alphaComponent)
            )
        }
    }

#endif
