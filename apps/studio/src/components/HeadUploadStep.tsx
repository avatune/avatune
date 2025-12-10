import { useRef, useState } from 'react'
import type { Asset } from '../types'

interface HeadUploadStepProps {
  onUpload: (asset: Asset) => void
  headAsset: Asset | null
}

const HeadUploadStep = ({ onUpload, headAsset }: HeadUploadStepProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    const dataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.readAsDataURL(file)
    })

    const asset: Asset = {
      id: `head-${Date.now()}`,
      name: file.name.replace(/\.[^/.]+$/, ''),
      file,
      dataUrl,
      category: 'head',
      xPercent: 0,
      yPercent: 0,
      layer: 1,
    }

    onUpload(asset)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
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
    <div className="rounded-xl border border-white/10 bg-slate-900/40 backdrop-blur-sm p-8">
      <h2 className="text-2xl font-semibold mb-4 text-white">
        Step 1: Upload Head Asset
      </h2>
      <p className="text-slate-300 mb-8">
        Upload the base head asset. This will be used as the reference point for
        positioning all other assets.
      </p>

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
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/5 px-6 py-3 text-base font-semibold text-white transition hover:border-white hover:bg-white/10"
            onClick={() => fileInputRef.current?.click()}
          >
            Replace Head Asset
          </button>
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
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />
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
    </div>
  )
}

export default HeadUploadStep
