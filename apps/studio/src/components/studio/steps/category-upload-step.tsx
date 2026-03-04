import { useRef, useState } from 'react'
import {
  type Asset,
  CATEGORIES,
  type CategoryId,
  DEFAULT_LAYERS,
} from '../../../types'
import { Badge, Button, Card, StepHeader } from '../../ui'

interface CategoryUploadStepProps {
  onAssetAdd: (asset: Asset) => void
  onNext: () => void
  existingAssets: Asset[]
  headAsset: Asset | null
}

const CategoryUploadStep = ({
  onAssetAdd,
  onNext,
  existingAssets,
  headAsset,
}: CategoryUploadStepProps) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(
    null,
  )
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const getCategoryAssets = (categoryId: CategoryId) => {
    return existingAssets.filter((asset) => asset.category === categoryId)
  }

  const isSvgFile = (file: File): boolean => {
    const isSvgType = file.type === 'image/svg+xml' || file.type === 'image/svg'
    const isSvgExtension = file.name.toLowerCase().endsWith('.svg')
    return isSvgType || isSvgExtension
  }

  const handleFileSelect = async (file: File, category: CategoryId) => {
    if (!isSvgFile(file)) {
      alert(
        'Please upload an SVG file. Only SVG format is supported for category assets.',
      )
      return
    }

    const dataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.readAsDataURL(file)
    })

    // Get image dimensions
    const { width, height } = await new Promise<{
      width: number
      height: number
    }>((resolve) => {
      const img = new Image()
      img.onload = () =>
        resolve({ width: img.naturalWidth, height: img.naturalHeight })
      img.src = dataUrl
    })

    const asset: Asset = {
      id: `${category}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name.replace(/\.[^/.]+$/, ''),
      file,
      dataUrl,
      category,
      // Default position at 0%, 0% from top-left (same as head)
      xPercent: 40,
      yPercent: 40,
      layer: DEFAULT_LAYERS[category],
      scale: 1,
      width,
      height,
    }

    onAssetAdd(asset)
  }

  const handleFilesSelect = async (files: FileList, category: CategoryId) => {
    const svgFiles = Array.from(files).filter((file) => isSvgFile(file))

    if (svgFiles.length === 0) {
      alert(
        'Please upload SVG files. Only SVG format is supported for category assets.',
      )
      return
    }

    // Show warning if some files were filtered out
    const nonSvgFiles = Array.from(files).filter((file) => !isSvgFile(file))
    if (nonSvgFiles.length > 0) {
      alert(
        `${nonSvgFiles.length} file(s) were skipped because they are not SVG files. Only SVG format is supported.`,
      )
    }

    for (const file of svgFiles) {
      await handleFileSelect(file, category)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0 && selectedCategory) {
      handleFilesSelect(files, selectedCategory)
      // Reset input to allow uploading the same files again
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDrop = (e: React.DragEvent, category: CategoryId) => {
    e.preventDefault()
    setDragging(false)
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleFilesSelect(files, category)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = () => {
    setDragging(false)
  }

  if (!headAsset) {
    return (
      <Card>
        <p className="text-slate-300">Please upload a head asset first.</p>
      </Card>
    )
  }

  return (
    <Card>
      <StepHeader
        title="Step 2: Upload Category Assets"
        description="Choose a category and upload SVG assets. You can upload multiple SVG files at once by selecting multiple files or dragging multiple files."
      />
      <div className="mb-6 p-4 bg-blue-500/10 border border-blue-400/30 rounded-lg">
        <p className="text-sm text-blue-200 font-medium">
          <span className="font-semibold text-blue-100">
            File Naming Convention:
          </span>{' '}
          Please follow the file naming convention for variants (e.g. "long",
          "short", "bobLong") so assets stay organized.
        </p>
      </div>

      {/* Notice about proportions */}
      <div className="mb-8 p-4 bg-amber-500/10 border border-amber-400/30 rounded-lg">
        <div className="flex items-start gap-3">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-amber-400 mt-0.5 shrink-0"
            aria-hidden="true"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <div>
            <p className="text-amber-300 font-medium mb-1">
              Keep Consistent Proportions
            </p>
            <p className="text-slate-300 text-sm leading-relaxed">
              All assets must maintain the same proportions as your head asset.
              For example, if your head asset is 500×500px, all category assets
              (eyes, mouth, hair, etc.) should maintain the same aspect ratio
              and proportions relative to the head. This ensures proper
              alignment and layering when assets are combined to create avatars.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 mb-8">
        {CATEGORIES.map((category) => {
          const categoryAssets = getCategoryAssets(category.id)
          const isSelected = selectedCategory === category.id
          // For head category, include the headAsset from Step 1 in the count
          const assetCount =
            category.id === 'head'
              ? categoryAssets.length + (headAsset ? 1 : 0)
              : categoryAssets.length

          return (
            <button
              key={category.id}
              type="button"
              className={`w-full text-left rounded-lg border-2 p-6 transition-all ${
                isSelected
                  ? 'border-pink-400 bg-pink-500/20 cursor-pointer'
                  : 'border-white/10 bg-slate-800/60 hover:border-white/20 hover:bg-slate-700/60 cursor-pointer'
              }`}
              onClick={() => setSelectedCategory(category.id)}
              aria-label={`Select ${category.label} category`}
            >
              <h3 className="text-lg font-semibold mb-2">{category.label}</h3>
              {category.optional && <Badge className="mb-2">Optional</Badge>}
              {assetCount > 0 && (
                <div className="text-sm text-slate-400 mt-2">
                  {assetCount} asset(s)
                </div>
              )}
              {category.id === 'head' && headAsset && (
                <div className="text-xs text-green-400 mt-2">
                  ✓ 1 uploaded in Step 1
                </div>
              )}
              {isSelected && (
                // biome-ignore lint/a11y/useSemanticElements: This div needs drag-and-drop functionality
                <div
                  className={`mt-4 border-2 border-dashed rounded-lg p-4 text-center text-sm transition-all ${
                    dragging
                      ? 'border-pink-400 bg-pink-500/10'
                      : 'border-white/20 bg-white/5 hover:border-white/40'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    fileInputRef.current?.click()
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      e.stopPropagation()
                      fileInputRef.current?.click()
                    }
                  }}
                  onDrop={(e) => handleDrop(e, category.id)}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  role="button"
                  tabIndex={0}
                  aria-label="Upload files for this category"
                >
                  <p>Drop SVG files here or click to select multiple</p>
                </div>
              )}
            </button>
          )
        })}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/svg+xml,.svg"
        multiple
        onChange={handleFileInputChange}
        className="hidden"
      />

      <div className="flex gap-4 mt-8">
        <Button onClick={onNext} disabled={existingAssets.length === 0}>
          Continue to Preview
        </Button>
      </div>
    </Card>
  )
}

export default CategoryUploadStep
