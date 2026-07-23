'use client'

import { Avatar } from '@avatune/react'
import type { Predictions } from '@avatune/types'
import Image from 'next/image'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createImageFromFile, validateImageFile } from '@/lib/file-handler'
import {
  initializePredictors,
  type Predictors,
  predictFromImage,
} from '@/lib/predictors'
import { getHairColors, getSkinToneColors } from '@/lib/theme-helpers'
import { getTheme, getThemeInfo, themeInfos } from '@/lib/themes'

const defaultPredictions: Predictions = {
  skinTone: 'medium',
  hairLength: 'medium',
  hairColor: 'brown',
  faceHair: 'facial_hair',
}

const stepDefinitions = [
  { key: 'skinTone', label: 'Skin tone' },
  { key: 'hairLength', label: 'Hair length' },
  { key: 'hairColor', label: 'Hair color' },
  { key: 'faceHair', label: 'Face hair' },
] as const

const buttonClass =
  'inline-flex cursor-pointer items-center gap-2 rounded-lg border border-line-2 bg-paper-3 px-4 py-2.5 text-sm font-medium whitespace-nowrap text-ink transition hover:border-line-strong hover:bg-paper-card active:translate-y-px'
const smallButtonClass =
  'inline-flex cursor-pointer items-center gap-2 rounded-lg border border-line-2 bg-paper-3 px-2.5 py-1 text-xs font-medium whitespace-nowrap text-ink transition hover:border-line-strong hover:bg-paper-card disabled:cursor-not-allowed disabled:opacity-50'
const primaryButtonClass =
  'inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-md border border-ink bg-ink px-2.5 py-1.5 text-xs font-medium whitespace-nowrap text-paper transition hover:border-white hover:bg-white active:translate-y-px'
const monoLabelClass =
  'font-code text-[11px] tracking-[0.16em] uppercase text-ink-3'

function formatStepValue(key: string, value: unknown): string {
  if (key === 'faceHair') {
    return value === 'facial_hair' ? 'Have facial hair' : 'No facial hair'
  }

  return String(value ?? 'Not available').replace(/_/g, ' ')
}

export function PredictionPipeline() {
  const [predictors, setPredictors] = useState<Predictors | null>(null)
  const [selectedThemeId, setSelectedThemeId] = useState('micah')
  const [isProcessing, setIsProcessing] = useState(false)
  const [predictions, setPredictions] = useState<Predictions | null>(
    defaultPredictions,
  )
  const [imageUrl, setImageUrl] = useState<string | null>('/prediction-2.jpg')
  const [filename, setFilename] = useState('prediction-2.jpg')
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isThemeOpen, setIsThemeOpen] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropdownButtonRef = useRef<HTMLButtonElement>(null)
  const dropdownMenuRef = useRef<HTMLDivElement>(null)
  const previewObjectUrlRef = useRef<string | null>(null)

  const currentPredictions = predictions ?? defaultPredictions
  const currentTheme = getTheme(selectedThemeId)
  const currentThemeInfo = getThemeInfo(selectedThemeId)
  const skinSwatches = getSkinToneColors(currentTheme, currentPredictions)
  const hairSwatches = getHairColors(currentTheme, currentPredictions)
  const stepData = useMemo(
    () =>
      stepDefinitions.map((step) => {
        const value = currentPredictions[step.key]
        const swatches =
          step.key === 'skinTone'
            ? skinSwatches.slice(0, 3)
            : step.key === 'hairColor'
              ? hairSwatches.slice(0, 3)
              : []

        return {
          key: step.key,
          label: step.label,
          value: formatStepValue(step.key, value),
          swatches,
          done: predictions !== null,
        }
      }),
    [currentPredictions, hairSwatches, predictions, skinSwatches],
  )

  useEffect(() => {
    let cancelled = false

    initializePredictors()
      .then((loadedPredictors) => {
        if (!cancelled) setPredictors(loadedPredictors)
      })
      .catch((loadError) => {
        console.error('Failed to load predictors:', loadError)
        if (!cancelled) {
          setError('Failed to load prediction models. Please refresh the page.')
        }
      })

    return () => {
      cancelled = true
      if (previewObjectUrlRef.current) {
        URL.revokeObjectURL(previewObjectUrlRef.current)
      }
    }
  }, [])

  const updateDropdownPosition = useCallback(() => {
    const button = dropdownButtonRef.current
    if (!button) return

    const rectangle = button.getBoundingClientRect()
    setDropdownPosition({
      top: rectangle.bottom + 4,
      left: rectangle.left,
      width: rectangle.width,
    })
  }, [])

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node
      const button = dropdownButtonRef.current
      const menu = dropdownMenuRef.current

      if (
        isThemeOpen &&
        button &&
        menu &&
        !button.contains(target) &&
        !menu.contains(target)
      ) {
        setIsThemeOpen(false)
      }
    }
    const handleViewportChange = () => {
      if (isThemeOpen) updateDropdownPosition()
    }

    window.addEventListener('click', handleOutsideClick)
    window.addEventListener('scroll', handleViewportChange)
    window.addEventListener('resize', handleViewportChange)

    return () => {
      window.removeEventListener('click', handleOutsideClick)
      window.removeEventListener('scroll', handleViewportChange)
      window.removeEventListener('resize', handleViewportChange)
    }
  }, [isThemeOpen, updateDropdownPosition])

  async function handleFile(file: File) {
    setError(null)

    if (!validateImageFile(file)) {
      setError('Please upload an image file.')
      return
    }
    if (!predictors) {
      setError('Models are still loading. Try again in a second.')
      return
    }

    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(previewObjectUrlRef.current)
    }
    const previewUrl = URL.createObjectURL(file)
    previewObjectUrlRef.current = previewUrl
    setImageUrl(previewUrl)
    setFilename(file.name)

    try {
      setIsProcessing(true)
      const image = await createImageFromFile(file)
      setPredictions(await predictFromImage(predictors, image))
    } catch (processingError) {
      console.error(processingError)
      setError('Failed to process image. Please try a different photo.')
      setPredictions(null)
    } finally {
      setIsProcessing(false)
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0]
    if (file) void handleFile(file)
  }

  function handleDragOver(event: React.DragEvent<HTMLLabelElement>) {
    event.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave(event: React.DragEvent<HTMLLabelElement>) {
    event.preventDefault()
    setIsDragging(false)
  }

  function handleDrop(event: React.DragEvent<HTMLLabelElement>) {
    event.preventDefault()
    setIsDragging(false)
    const file = event.dataTransfer.files?.[0]
    if (file) void handleFile(file)
  }

  function toggleTheme(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation()
    if (!isThemeOpen) updateDropdownPosition()
    setIsThemeOpen((open) => !open)
  }

  function pickTheme(themeId: string) {
    setSelectedThemeId(themeId)
    setIsThemeOpen(false)
  }

  async function copyResult() {
    const payload = JSON.stringify(
      { theme: selectedThemeId, predictions: currentPredictions },
      null,
      2,
    )

    try {
      await navigator.clipboard.writeText(payload)
      window.dispatchEvent(
        new CustomEvent('avatune:toast', {
          detail: 'Copied avatar config',
        }),
      )
    } catch {
      return
    }
  }

  return (
    <div className="grid grid-cols-1 overflow-hidden rounded-[14px] border border-line bg-[#0d0d0d] lg:grid-cols-[1fr_1.1fr_1fr]">
      <div className="flex min-h-[480px] flex-col gap-[18px] border-b border-line p-8 lg:border-r lg:border-b-0">
        <div className={`${monoLabelClass} flex items-center gap-2.5`}>
          01 · Source
        </div>

        <label
          htmlFor="predictor-file-input"
          aria-label={`Upload photo, current file ${filename}`}
          className={`relative flex flex-1 cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-[10px] border p-5 transition ${
            isDragging
              ? 'border-emerald-mark bg-emerald-mark/[0.06]'
              : 'border-line-2 bg-paper'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt="uploaded preview"
              width={200}
              height={200}
              unoptimized
              className="max-h-[200px] max-w-[200px] rounded-[10px] border border-line-2 object-contain"
            />
          ) : (
            <div className="relative h-[280px] w-[280px] rounded-full [background:radial-gradient(circle_at_50%_38%,#2a2a2a_0%,#1a1a1a_50%,#0e0e0e_100%)]" />
          )}

          <span className={`${buttonClass} mt-1`}>
            <svg
              aria-hidden="true"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <path d="M17 8 12 3 7 8" />
              <path d="M12 3v12" />
            </svg>
            {imageUrl ? 'Replace' : 'Upload photo'}
          </span>

          <input
            id="predictor-file-input"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleFileChange}
          />

          {isProcessing && (
            <div className="absolute inset-0 flex items-center justify-center bg-paper/70 backdrop-blur-[2px]">
              <span className={monoLabelClass}>Inferring…</span>
            </div>
          )}
        </label>

        {error && <p className="text-xs text-coral-mark">{error}</p>}
      </div>

      <div className="flex min-h-[480px] flex-col gap-[18px] border-b border-line p-8 lg:border-r lg:border-b-0">
        <div className="flex items-center justify-between">
          <span className={monoLabelClass}>02 · Inferred parts</span>
          <button
            type="button"
            className={smallButtonClass}
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
          >
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M6 4l14 8-14 8z" />
            </svg>
            Re-run
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {stepData.map((step, index) => (
            <div
              key={step.key}
              className="grid grid-cols-[28px_1fr_auto] items-center gap-3.5 rounded-[10px] border border-line bg-[#0b0b0b] px-3.5 py-3 transition"
            >
              <div className="grid h-6 w-6 place-items-center rounded-full border border-line-2 bg-[#1a1a1a] font-code text-[11px] font-semibold text-ink-2 transition">
                {index + 1}
              </div>
              <div>
                <div className={`${monoLabelClass} whitespace-nowrap`}>
                  {step.label}
                </div>
                <div className="text-sm text-ink">{step.value}</div>
              </div>
              <div className="flex gap-1">
                {step.swatches.map((swatch) => (
                  <span
                    key={`${step.key}-${swatch}`}
                    className="inline-block h-[18px] w-[18px] rounded border border-black/40 opacity-35 shadow-[0_0_0_1px_var(--color-line-2)]"
                    style={{ background: swatch }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex min-h-[480px] flex-col gap-[18px] p-8">
        <div className={monoLabelClass}>03 · Result</div>

        <div className="flex flex-1 flex-col items-center justify-center gap-[18px]">
          <div className="pg-frame-checker relative grid h-[200px] w-[200px] place-items-center overflow-hidden rounded-full border border-line-2 [&>*]:relative [&>*]:z-[1]">
            <Avatar
              key={`${selectedThemeId}-${JSON.stringify(currentPredictions)}`}
              theme={currentTheme}
              size={200}
              predictions={currentPredictions}
            />
          </div>

          <div className="flex w-full max-w-[240px] flex-col items-center gap-2">
            <span className={monoLabelClass}>
              Theme · {currentThemeInfo.label}
            </span>
            <div className="relative w-full">
              <button
                ref={dropdownButtonRef}
                type="button"
                onClick={toggleTheme}
                className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-md border border-line-2 bg-paper-3 px-3 py-2 text-xs text-ink transition hover:border-line-strong"
                aria-haspopup="listbox"
                aria-expanded={isThemeOpen}
              >
                <span className="flex items-center gap-2">
                  <span className="block h-6 w-6 shrink-0 overflow-hidden rounded border border-line">
                    <Avatar
                      key={selectedThemeId}
                      theme={currentTheme}
                      size={24}
                      predictions={currentPredictions}
                    />
                  </span>
                  <span className="text-ink">{currentThemeInfo.label}</span>
                </span>
                <svg
                  aria-hidden="true"
                  className="h-4 w-4 text-ink-2 transition-transform"
                  style={{ transform: isThemeOpen ? 'rotate(180deg)' : 'none' }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isThemeOpen && (
                <div
                  ref={dropdownMenuRef}
                  className="fixed z-50 max-h-64 overflow-y-auto rounded-md border border-line-2 bg-[rgba(16,16,16,0.97)] shadow-2xl backdrop-blur-sm"
                  style={dropdownPosition}
                  role="listbox"
                >
                  {themeInfos.map((themeInfo) => (
                    <button
                      key={themeInfo.id}
                      type="button"
                      onClick={() => pickTheme(themeInfo.id)}
                      className="flex w-full cursor-pointer items-center gap-2 border-0 bg-transparent px-3 py-2 text-left text-xs text-ink transition hover:bg-paper-3"
                      style={{
                        background:
                          selectedThemeId === themeInfo.id
                            ? 'rgba(25, 179, 133, 0.12)'
                            : '',
                      }}
                    >
                      <span className="block h-8 w-8 shrink-0 overflow-hidden rounded border border-line">
                        <Avatar
                          key={themeInfo.id}
                          theme={getTheme(themeInfo.id)}
                          size={32}
                          predictions={currentPredictions}
                        />
                      </span>
                      <span className="flex-1">{themeInfo.label}</span>
                      {selectedThemeId === themeInfo.id && (
                        <svg
                          aria-hidden="true"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-emerald-mark"
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              className={`${primaryButtonClass} mt-2`}
              onClick={copyResult}
            >
              <svg
                aria-hidden="true"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
              Use this avatar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
