import { useEffect, useState } from 'react'
import type { ThemeData } from '../../../types'
import {
  generateThemeFile,
  generateThemeFolder,
} from '../../../utils/themeGenerator'
import { GitHubContributionGuide } from '../../guides'
import { Button, Card, Input, StepHeader } from '../../ui'

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
    <Card>
      <StepHeader
        title="Step 4: Save Theme"
        description="Enter a theme name and generate the theme folder structure."
      />

      <div className="mt-8">
        <div className="mb-6">
          <Input
            id="theme-name-input"
            label="Theme Name"
            value={themeName}
            onChange={(e) => setThemeName(e.target.value)}
            placeholder="my-theme"
            disabled={generated}
            hint={`This will be used for both package names (e.g., ${themeName}-assets and ${themeName}-theme)`}
          />
        </div>

        {generated ? (
          <div className="p-8 bg-green-500/10 border-2 border-green-500/30 rounded-lg">
            <h3 className="mb-4 text-xl font-semibold text-green-400 text-center">
              Packages Generated Successfully!
            </h3>
            <p className="mb-6 text-slate-300 text-center">
              A ZIP file containing both the assets and theme packages has been
              downloaded.
            </p>

            <GitHubContributionGuide themeName={themeName} />

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
              <Button variant="ghost" onClick={onReset}>
                Create New Theme
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex gap-4">
            <Button variant="ghost" onClick={onBack}>
              Back
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !themeName.trim()}
            >
              {isGenerating ? 'Generating...' : 'Generate & Download Theme'}
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}

export default SaveThemeStep
