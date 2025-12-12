import { useEffect, useState } from 'react'
import type { ThemeData } from '../types'
import { generateThemeFile, generateThemeFolder } from '../utils/themeGenerator'

interface SaveThemeStepProps {
  themeData: ThemeData
  onBack: () => void
  onReset: () => void
}

const SaveThemeStep = ({ themeData, onBack, onReset }: SaveThemeStepProps) => {
  const [themeName, setThemeName] = useState(themeData.themeName || 'my-theme')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)

  // Update theme name when themeData changes
  useEffect(() => {
    if (themeData.themeName) {
      setThemeName(themeData.themeName)
    }
  }, [themeData.themeName])

  const handleGenerate = async () => {
    const finalThemeName = themeName.trim() || themeData.themeName || 'my-theme'
    if (!finalThemeName.trim()) {
      alert('Please enter a theme name')
      return
    }

    if (!themeData.headAsset) {
      alert('Head asset is required')
      return
    }

    setIsGenerating(true)
    try {
      const finalThemeName =
        themeName.trim() || themeData.themeName || 'my-theme'
      const themeCode = generateThemeFile(themeData)
      await generateThemeFolder(finalThemeName, themeCode, themeData)
      setGenerated(true)
    } catch (error) {
      console.error('Error generating theme:', error)
      alert('Error generating theme. Check console for details.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/40 backdrop-blur-sm p-8">
      <h2 className="text-2xl font-semibold mb-4 text-white">
        Step 4: Save Theme
      </h2>
      <p className="text-slate-300 mb-8">
        Enter a theme name and generate the theme folder structure.
      </p>

      <div className="mt-8">
        <div className="mb-6">
          <label
            htmlFor="theme-name-input"
            className="block mb-2 font-medium text-slate-300"
          >
            Theme Name
          </label>
          <input
            id="theme-name-input"
            type="text"
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-pink-400 focus:bg-white/15 disabled:opacity-50"
            value={themeName}
            onChange={(e) => setThemeName(e.target.value)}
            placeholder="my-theme"
            disabled={generated}
          />
          <p className="mt-2 text-sm text-slate-400">
            This will be used for both package names (e.g., {themeName}-assets
            and {themeName}-theme)
          </p>
        </div>

        <div className="p-6 bg-white/5 rounded-lg border border-white/10 mb-8">
          <h3 className="mb-4 text-lg font-semibold">Theme Summary</h3>
          <ul className="space-y-2">
            <li className="py-2 border-b border-white/10">
              Head asset: {themeData.headAsset?.name || 'None'}
            </li>
            <li className="py-2 border-b border-white/10">
              Total assets:{' '}
              {themeData.assets.length + (themeData.headAsset ? 1 : 0)}
            </li>
            <li className="py-2 border-b border-white/10">
              Canvas size: {themeData.size}px
            </li>
            <li className="py-2 border-b border-white/10">
              Border radius: {themeData.borderRadius}
            </li>
            <li className="py-2">
              Categories:{' '}
              {new Set(themeData.assets.map((a) => a.category)).size}
            </li>
          </ul>
        </div>

        {generated ? (
          <div className="p-8 bg-green-500/10 border-2 border-green-500/30 rounded-lg">
            <h3 className="mb-4 text-xl font-semibold text-green-400 text-center">
              ✓ Packages Generated Successfully!
            </h3>
            <p className="mb-6 text-slate-300 text-center">
              A ZIP file containing both the assets and theme packages has been
              downloaded.
            </p>

            {/* Contribution Guide */}
            <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-4">
                How to Contribute Your Theme
              </h4>

              {/* Option 1: Create Issue */}
              <div className="mb-4">
                <h5 className="text-md font-medium text-pink-400 mb-2">
                  Option 1: Create a GitHub Issue (Easiest)
                </h5>
                <ol className="list-decimal list-inside space-y-1 text-sm text-slate-300 ml-2">
                  <li>
                    Go to{' '}
                    <a
                      href="https://github.com/avatune/avatune/issues/new"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-400 hover:text-pink-300 underline"
                    >
                      Create New Issue
                    </a>
                  </li>
                  <li>
                    Title:{' '}
                    <code className="bg-black/30 px-1 rounded text-xs">
                      [Theme Submission] {themeName}
                    </code>
                  </li>
                  <li>Drag & drop the ZIP file into the issue description</li>
                  <li>Add a preview image of your theme (optional)</li>
                  <li>Submit the issue</li>
                </ol>
              </div>

              {/* Option 2: Create PR */}
              <div className="mb-4">
                <h5 className="text-md font-medium text-pink-400 mb-2">
                  Option 2: Create a Pull Request
                </h5>
                <ol className="list-decimal list-inside space-y-1 text-sm text-slate-300 ml-2">
                  <li>
                    <a
                      href="https://github.com/avatune/avatune/fork"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-400 hover:text-pink-300 underline"
                    >
                      Fork the repository
                    </a>
                  </li>
                  <li>
                    Clone your fork:{' '}
                    <code className="bg-black/30 px-1 rounded text-xs">
                      git clone https://github.com/YOUR_USERNAME/avatune.git
                    </code>
                  </li>
                  <li>
                    Create a branch:{' '}
                    <code className="bg-black/30 px-1 rounded text-xs">
                      git checkout -b theme/{themeName}
                    </code>
                  </li>
                  <li>Extract ZIP and copy folders:</li>
                </ol>
                <div className="ml-6 mt-2 space-y-1">
                  <p className="text-slate-300 text-sm">
                    <code className="bg-black/30 px-2 py-1 rounded font-mono text-xs">
                      {themeName}-assets/
                    </code>{' '}
                    →{' '}
                    <code className="bg-black/30 px-2 py-1 rounded font-mono text-xs">
                      packages/assets/{themeName}-assets/
                    </code>
                  </p>
                  <p className="text-slate-300 text-sm">
                    <code className="bg-black/30 px-2 py-1 rounded font-mono text-xs">
                      {themeName}-theme/
                    </code>{' '}
                    →{' '}
                    <code className="bg-black/30 px-2 py-1 rounded font-mono text-xs">
                      packages/themes/{themeName}-theme/
                    </code>
                  </p>
                </div>
                <ol
                  className="list-decimal list-inside space-y-1 text-sm text-slate-300 ml-2 mt-2"
                  start={5}
                >
                  <li>
                    Commit:{' '}
                    <code className="bg-black/30 px-1 rounded text-xs">
                      git add . && git commit -m "feat: add {themeName} theme"
                    </code>
                  </li>
                  <li>
                    Push:{' '}
                    <code className="bg-black/30 px-1 rounded text-xs">
                      git push origin theme/{themeName}
                    </code>
                  </li>
                  <li>
                    <a
                      href="https://github.com/avatune/avatune/compare"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-400 hover:text-pink-300 underline"
                    >
                      Create Pull Request
                    </a>
                  </li>
                </ol>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <a
                href="https://github.com/avatune/avatune/issues/new"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-slate-700 px-6 py-3 text-base font-semibold text-white transition-all hover:bg-slate-600 hover:scale-105"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                Create Issue
              </a>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/5 px-6 py-3 text-base font-semibold text-white transition hover:border-white hover:bg-white/10"
                onClick={onReset}
              >
                Create New Theme
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-4">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/5 px-6 py-3 text-base font-semibold text-white transition hover:border-white hover:bg-white/10"
              onClick={onBack}
            >
              Back
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full bg-pink-400 px-6 py-3 text-base font-semibold text-white transition-all hover:bg-pink-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              onClick={handleGenerate}
              disabled={isGenerating || !themeName.trim()}
            >
              {isGenerating ? 'Generating...' : 'Generate Theme'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default SaveThemeStep
