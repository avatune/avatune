import AvatuneAllThemes
import AvatuneCore
import AvatuneRender
import Foundation

#if canImport(AppKit)
    import AppKit
#endif

/// Renders avatars to PNG so the visual-parity suite can compare them against
/// the baselines the web renderer produced.
///
/// Usage: AvatuneSnapshot <jobs.json> <output-directory>
///
/// The job list comes from the test rather than being hardcoded, so the seeds
/// stay defined in one place alongside the baselines they generated.
struct Job: Decodable {
    let theme: String
    let seed: String
    /// Output basename, matching the baseline it will be compared against.
    let name: String
    let size: Double
}

func fail(_ message: String) -> Never {
    FileHandle.standardError.write(Data("AvatuneSnapshot: \(message)\n".utf8))
    exit(1)
}

let arguments = Swift.CommandLine.arguments
guard arguments.count == 3 else {
    fail("usage: AvatuneSnapshot <jobs.json> <output-directory>")
}

let jobsURL = URL(fileURLWithPath: arguments[1])
let outputDirectory = URL(fileURLWithPath: arguments[2])

let jobs: [Job]
do {
    jobs = try JSONDecoder().decode([Job].self, from: Data(contentsOf: jobsURL))
} catch {
    fail("cannot read jobs from \(jobsURL.path): \(error)")
}

try? FileManager.default.createDirectory(
    at: outputDirectory, withIntermediateDirectories: true)

#if canImport(AppKit)
    var rendered = 0

    for job in jobs {
        guard let theme = allThemes[job.theme] else {
            fail("unknown theme '\(job.theme)'")
        }

        let avatar = ResolvedAvatar(theme: theme, seed: .string(job.seed))
        guard let image = AvatarImageRenderer.cgImage(avatar, size: job.size, scale: 1) else {
            fail("failed to render \(job.name)")
        }

        let representation = NSBitmapImageRep(cgImage: image)
        guard let png = representation.representation(using: .png, properties: [:]) else {
            fail("failed to encode \(job.name)")
        }

        do {
            try png.write(to: outputDirectory.appendingPathComponent("\(job.name).png"))
            // Optional, so the parity run stays PNG-only: the SVG exporter has
            // its own comparison and does not need to slow the common path.
            if ProcessInfo.processInfo.environment["AVATUNE_EMIT_SVG"] != nil {
                try avatar.svg(size: job.size).data(using: .utf8)?.write(
                    to: outputDirectory.appendingPathComponent("\(job.name).svg"))
            }
        } catch {
            fail("cannot write \(job.name): \(error)")
        }
        rendered += 1
    }

    print("rendered \(rendered) avatar(s) to \(outputDirectory.path)")
#else
    fail("snapshot rendering requires AppKit")
#endif
