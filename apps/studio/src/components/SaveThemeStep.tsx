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
          <div className="p-8 text-center bg-green-500/10 border-2 border-green-500/30 rounded-lg">
            <h3 className="mb-4 text-xl font-semibold text-green-400">
              ✓ Packages Generated Successfully!
            </h3>
            <p className="mb-6 text-slate-300">
              A ZIP file containing both the assets and theme packages has been
              downloaded. Extract it and place the folders in their respective
              directories:
            </p>
            <div className="mb-6 text-left space-y-2">
              <p className="text-slate-300">
                <code className="bg-black/30 px-2 py-1 rounded font-mono text-sm">
                  {themeName}-assets
                </code>{' '}
                →{' '}
                <code className="bg-black/30 px-2 py-1 rounded font-mono text-sm">
                  packages/assets/
                </code>
              </p>
              <p className="text-slate-300">
                <code className="bg-black/30 px-2 py-1 rounded font-mono text-sm">
                  {themeName}-theme
                </code>{' '}
                →{' '}
                <code className="bg-black/30 px-2 py-1 rounded font-mono text-sm">
                  packages/themes/
                </code>
              </p>
            </div>
            <p className="mb-6 text-sm text-slate-400">
              You can now create a GitHub issue with this ZIP file attached.
            </p>
            <div className="flex justify-center">
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
