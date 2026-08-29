#if canImport(AppKit)

    import AppKit
    import SwiftUI

    /// Launches the Avatune window.
    ///
    /// Bootstrapped through AppKit rather than SwiftUI's `@main App` because a
    /// SwiftPM executable runs unbundled: without setting the activation policy
    /// explicitly the process has no dock presence and the window never takes
    /// focus.
    final class AvatuneAppDelegate: NSObject, NSApplicationDelegate {
        private var window: NSWindow?

        func applicationDidFinishLaunching(_ notification: Notification) {
            guard #available(macOS 13.0, *) else {
                let alert = NSAlert()
                alert.messageText = "Avatune needs macOS 13 or later"
                alert.informativeText =
                    "The browser uses NavigationSplitView and grouped forms, which are not "
                    + "available on this system."
                alert.runModal()
                NSApp.terminate(nil)
                return
            }

            let window = NSWindow(
                contentRect: NSRect(x: 0, y: 0, width: 1180, height: 780),
                styleMask: [.titled, .closable, .miniaturizable, .resizable, .fullSizeContentView],
                backing: .buffered,
                defer: false
            )
            window.title = "Avatune"
            window.titlebarAppearsTransparent = false
            window.contentMinSize = NSSize(width: 640, height: 420)
            window.contentView = NSHostingView(rootView: BrowserView())
            window.setFrameAutosaveName("AvatuneBrowser")
            window.center()
            window.makeKeyAndOrderFront(nil)
            self.window = window

            NSApp.activate(ignoringOtherApps: true)
        }

        func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool {
            true
        }
    }

    /// A minimal menu bar. Without one the window has no ⌘Q, ⌘W or edit commands,
    /// which an unbundled executable does not get for free.
    func installMainMenu() {
        let mainMenu = NSMenu()

        let appMenuItem = NSMenuItem()
        let appMenu = NSMenu()
        appMenu.addItem(
            withTitle: "Hide Avatune", action: #selector(NSApplication.hide(_:)), keyEquivalent: "h")
        appMenu.addItem(.separator())
        appMenu.addItem(
            withTitle: "Quit Avatune", action: #selector(NSApplication.terminate(_:)),
            keyEquivalent: "q")
        appMenuItem.submenu = appMenu
        mainMenu.addItem(appMenuItem)

        let editMenuItem = NSMenuItem()
        let editMenu = NSMenu(title: "Edit")
        for (title, selector, key) in [
            ("Cut", #selector(NSText.cut(_:)), "x"),
            ("Copy", #selector(NSText.copy(_:)), "c"),
            ("Paste", #selector(NSText.paste(_:)), "v"),
            ("Select All", #selector(NSText.selectAll(_:)), "a"),
        ] {
            editMenu.addItem(withTitle: title, action: selector, keyEquivalent: key)
        }
        editMenuItem.submenu = editMenu
        mainMenu.addItem(editMenuItem)

        let windowMenuItem = NSMenuItem()
        let windowMenu = NSMenu(title: "Window")
        windowMenu.addItem(
            withTitle: "Close", action: #selector(NSWindow.performClose(_:)), keyEquivalent: "w")
        windowMenuItem.submenu = windowMenu
        mainMenu.addItem(windowMenuItem)

        NSApp.mainMenu = mainMenu
        NSApp.windowsMenu = windowMenu
    }

    let application = NSApplication.shared
    application.setActivationPolicy(.regular)
    let delegate = AvatuneAppDelegate()
    application.delegate = delegate
    installMainMenu()
    application.run()

#else

    import Foundation

    FileHandle.standardError.write(Data("Avatune requires macOS.\n".utf8))
    exit(1)

#endif
