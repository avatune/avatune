import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Asset, ThemeData } from '../../types'
import { Stepper } from './stepper'
import {
  CategoryUploadStep,
  HeadUploadStep,
  PreviewStep,
  SaveThemeStep,
} from './steps'

type Step = 'head' | 'categories' | 'preview' | 'save'

export const Studio = () => {
  const navigate = useNavigate()
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
      <Stepper
        currentStep={step}
        onStepClick={handleStepClick}
        canNavigateToStep={canNavigateToStep}
      />

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
              navigate('/')
            }}
          />
        )}
      </main>
    </div>
  )
}
