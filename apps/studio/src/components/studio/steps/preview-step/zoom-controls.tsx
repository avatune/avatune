import { useEffect, useState } from 'react'

interface ZoomControlsProps {
  calculatedSize: number
  onSizeChange: (size: number) => void
  previewSize: number
}

export const ZoomControls = ({
  calculatedSize,
  onSizeChange,
  previewSize,
}: ZoomControlsProps) => {
  const [inputValue, setInputValue] = useState(calculatedSize.toString())

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    const numValue = Number.parseInt(value, 10)
    if (!Number.isNaN(numValue) && numValue > 0) {
      onSizeChange(numValue)
    }
  }

  // Update input value when calculatedSize changes externally
  useEffect(() => {
    setInputValue(calculatedSize.toString())
  }, [calculatedSize])

  const handleReset = () => {
    setInputValue(previewSize.toString())
    onSizeChange(previewSize)
  }

  return (
    <div className="mb-4">
      <div className="mb-2 text-sm text-slate-300 font-medium">
        Avatar Container Size
      </div>
      <p className="text-xs text-slate-400 mb-3">
        Adjust according to your head and make sense that all assets need to be
        inside of this container visible.
      </p>
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            min="50"
            max="2000"
            className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-center text-sm focus:outline-none focus:border-pink-400"
            aria-label="Container size in pixels"
          />
          <span className="text-md text-slate-400">px</span>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="px-2 sm:px-3 h-8 rounded-md bg-slate-800/60 border border-white/20 text-white hover:bg-slate-700/60 transition-colors text-xs shrink-0"
          aria-label="Reset container size"
        >
          Reset
        </button>
      </div>
    </div>
  )
}
