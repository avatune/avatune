import { useState } from 'react'
import {
  CategoryUploadStep,
  HeadUploadStep,
  PreviewStep,
  SaveThemeStep,
} from './components/steps'
import type { Asset, ThemeData } from './types'

type Step = 'head' | 'categories' | 'preview' | 'save'

const App = () => {
  const [step, setStep] = useState<Step>('head')
  const [themeData, setThemeData] = useState<ThemeData>({
    headAsset: null,
    assets: [],
    themeName: '',
    size: 400,
    borderRadius: '100%',
  })

  const handleHeadUpload = (asset: Asset) => {
    setThemeData((prev) => ({ ...prev, headAsset: asset }))
    setStep('categories')
  }

  const handleAssetAdd = (asset: Asset) => {
    setThemeData((prev) => ({
      ...prev,
      assets: [...prev.assets, asset],
    }))
  }

  const handleAssetUpdate = (assetId: string, updates: Partial<Asset>) => {
    setThemeData((prev) => {
      // Check if updating the head asset
      if (prev.headAsset?.id === assetId) {
        // Calculate how much the head moved
        const deltaX =
          updates.xPercent !== undefined
            ? updates.xPercent - prev.headAsset.xPercent
            : 0
        const deltaY =
          updates.yPercent !== undefined
            ? updates.yPercent - prev.headAsset.yPercent
            : 0

        // Move all other assets by the same delta
        const updatedAssets =
          deltaX !== 0 || deltaY !== 0
            ? prev.assets.map((asset) => ({
                ...asset,
                xPercent: asset.xPercent + deltaX,
                yPercent: asset.yPercent + deltaY,
              }))
            : prev.assets

        return {
          ...prev,
          headAsset: { ...prev.headAsset, ...updates },
          assets: updatedAssets,
        }
      }
      // Otherwise update in assets array
      return {
        ...prev,
        assets: prev.assets.map((asset) =>
          asset.id === assetId ? { ...asset, ...updates } : asset,
        ),
      }
    })
  }

  const handleAssetRemove = (assetId: string) => {
    setThemeData((prev) => ({
      ...prev,
      assets: prev.assets.filter((asset) => asset.id !== assetId),
    }))
  }

  const handleThemeSettingsChange = (
    size: number,
    borderRadius: string,
    themeName?: string,
  ) => {
    setThemeData((prev) => ({
      ...prev,
      size,
      borderRadius,
      ...(themeName !== undefined && { themeName }),
    }))
  }

  const canNavigateToStep = (targetStep: Step): boolean => {
    switch (targetStep) {
      case 'head':
        return true
      case 'categories':
        return themeData.headAsset !== null
      case 'preview':
        return themeData.headAsset !== null && themeData.assets.length > 0
      case 'save':
        return step === 'preview' || step === 'save'
      default:
        return false
    }
  }

  const handleStepClick = (targetStep: Step) => {
    if (canNavigateToStep(targetStep)) {
      setStep(targetStep)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white antialiased flex flex-col">
      <header className="border-b border-white/10 px-6 py-8 sm:px-12 lg:px-16">
        <h1 className="text-center text-4xl font-bold mb-8 text-white">
          Theme Uploader
        </h1>
        <div className="flex justify-center gap-8 flex-wrap">
          <button
            type="button"
            onClick={() => handleStepClick('head')}
            className="flex flex-col items-center gap-2 cursor-pointer transition-opacity hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!canNavigateToStep('head')}
            aria-label="Navigate to Head step"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold border-2 transition-colors ${
                step === 'head'
                  ? 'bg-pink-500 border-pink-400 text-white'
                  : step === 'categories' ||
                      step === 'preview' ||
                      step === 'save'
                    ? 'bg-green-500 border-green-400 text-white'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400'
              }`}
            >
              1
            </div>
            <span className="text-xs uppercase tracking-wider text-slate-400">
              Head
            </span>
          </button>
          <button
            type="button"
            onClick={() => handleStepClick('categories')}
            className="flex flex-col items-center gap-2 cursor-pointer transition-opacity hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!canNavigateToStep('categories')}
            aria-label="Navigate to Categories step"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold border-2 transition-colors ${
                step === 'categories'
                  ? 'bg-pink-500 border-pink-400 text-white'
                  : step === 'preview' || step === 'save'
                    ? 'bg-green-500 border-green-400 text-white'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400'
              }`}
            >
              2
            </div>
            <span className="text-xs uppercase tracking-wider text-slate-400">
              Categories
            </span>
          </button>
          <button
            type="button"
            onClick={() => handleStepClick('preview')}
            className="flex flex-col items-center gap-2 cursor-pointer transition-opacity hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!canNavigateToStep('preview')}
            aria-label="Navigate to Preview step"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold border-2 transition-colors ${
                step === 'preview'
                  ? 'bg-pink-500 border-pink-400 text-white'
                  : step === 'save'
                    ? 'bg-green-500 border-green-400 text-white'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400'
              }`}
            >
              3
            </div>
            <span className="text-xs uppercase tracking-wider text-slate-400">
              Preview
            </span>
          </button>
          <button
            type="button"
            onClick={() => handleStepClick('save')}
            className="flex flex-col items-center gap-2 cursor-pointer transition-opacity hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!canNavigateToStep('save')}
            aria-label="Navigate to Save step"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold border-2 transition-colors ${
                step === 'save'
                  ? 'bg-pink-500 border-pink-400 text-white'
                  : 'bg-slate-800/60 border-slate-700 text-slate-400'
              }`}
            >
              4
            </div>
            <span className="text-xs uppercase tracking-wider text-slate-400">
              Save
            </span>
          </button>
        </div>
      </header>

      <main className="flex-1 px-6 py-8 sm:px-12 lg:px-16 max-w-7xl w-full mx-auto">
        {step === 'head' && (
          <HeadUploadStep
            onUpload={handleHeadUpload}
            headAsset={themeData.headAsset}
          />
        )}
        {step === 'categories' && (
          <CategoryUploadStep
            onAssetAdd={handleAssetAdd}
            onNext={() => setStep('preview')}
            existingAssets={themeData.assets}
            headAsset={themeData.headAsset}
          />
        )}
        {step === 'preview' && (
          <PreviewStep
            themeData={themeData}
            onAssetUpdate={handleAssetUpdate}
            onAssetRemove={handleAssetRemove}
            onNext={() => setStep('save')}
            onBack={() => setStep('categories')}
            onThemeSettingsChange={handleThemeSettingsChange}
          />
        )}
        {step === 'save' && (
          <SaveThemeStep
            themeData={themeData}
            onBack={() => setStep('preview')}
            onReset={() => {
              setThemeData({
                headAsset: null,
                assets: [],
                themeName: '',
                size: 400,
                borderRadius: '100%',
              })
              setStep('head')
            }}
          />
        )}
      </main>
    </div>
  )
}

export default App
