import { useRef, useState } from 'react'
import type { Asset } from '../../types'
import { Button, Card, StepHeader } from '../ui'

interface HeadUploadStepProps {
  onUpload: (asset: Asset) => void
  headAsset: Asset | null
}

const HeadUploadStep = ({ onUpload, headAsset }: HeadUploadStepProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const isSupportedImageFile = (file: File) => {
    const allowedExtensions = ['.svg', '.png', '.jpg', '.jpeg']
    const hasImageMime = file.type.startsWith('image/')
    const hasAllowedExtension = allowedExtensions.some((ext) =>
      file.name.toLowerCase().endsWith(ext),
    )
    return hasImageMime || hasAllowedExtension
  }

  const handleFileSelect = async (file: File) => {
    if (!isSupportedImageFile(file)) {
      alert('Please upload an SVG, PNG, or JPG file')
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
      id: `head-${Date.now()}`,
      name: file.name.replace(/\.[^/.]+$/, ''),
      file,
      dataUrl,
      category: 'head',
      // Default position at center of canvas (50%, 50%)
      xPercent: 40,
      yPercent: 40,
      layer: 1,
      width,
      height,
    }

    onUpload(asset)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
      // Reset so the same file can be re-selected after replacement
      e.target.value = ''
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = () => {
    setDragging(false)
  }

  return (
    <Card>
      <StepHeader
        title="Step 1: Upload Head Asset"
        description="Upload the base head asset. This will be used as the reference point for positioning all other assets."
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/svg+xml,image/png,image/jpeg,.svg,.png,.jpg,.jpeg"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Notice about head asset importance */}
      <div className="mb-8 p-4 bg-blue-500/10 border border-blue-400/30 rounded-lg">
        <div className="flex items-start gap-3">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-blue-400 mt-0.5 shrink-0"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
          <div>
            <p className="text-blue-300 font-medium mb-1">Foundation Asset</p>
            <p className="text-slate-300 text-sm leading-relaxed">
              The head asset serves as the foundation for your entire theme. All
              other assets (eyes, mouth, hair, accessories) will be positioned
              and layered relative to this base. Choose an asset that represents
              the core style and proportions for your avatar theme.
            </p>
          </div>
        </div>
      </div>

      {headAsset ? (
        <div className="text-center">
          <div className="inline-block mb-4 rounded-lg overflow-hidden border-2 border-white/20">
            <img
              src={headAsset.dataUrl}
              alt={headAsset.name}
              className="max-w-[300px] max-h-[300px] block"
            />
          </div>
          <p className="font-medium mb-4">{headAsset.name}</p>
          <Button variant="ghost" onClick={() => fileInputRef.current?.click()}>
            Replace Head Asset
          </Button>
        </div>
      ) : (
        <button
          type="button"
          className={`border-2 border-dashed rounded-xl p-16 text-center cursor-pointer transition-all w-full ${
            dragging
              ? 'border-pink-400 bg-pink-500/10'
              : 'border-white/30 bg-white/5 hover:border-white/50 hover:bg-white/10'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center gap-4">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-slate-400"
              aria-hidden="true"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p className="text-lg text-white">
              Click or drag to upload head asset
            </p>
            <p className="text-sm text-slate-400">SVG, PNG, or JPG files</p>
          </div>
        </button>
      )}
    </Card>
  )
}

export default HeadUploadStep
