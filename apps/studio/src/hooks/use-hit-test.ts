import { useCallback, useEffect, useRef } from 'react'
import type { Asset } from '../types'

const imageCache = new Map<string, HTMLImageElement>()

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  const cached = imageCache.get(dataUrl)
  if (cached) return Promise.resolve(cached)

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      imageCache.set(dataUrl, img)
      resolve(img)
    }
    img.onerror = reject
    img.src = dataUrl
  })
}

function isPixelOpaque(
  img: HTMLImageElement,
  localX: number,
  localY: number,
  threshold = 10,
): boolean {
  const canvas = document.createElement('canvas')
  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) return false

  ctx.drawImage(img, 0, 0)

  const px = Math.floor(localX)
  const py = Math.floor(localY)

  if (px < 0 || py < 0 || px >= canvas.width || py >= canvas.height)
    return false

  const pixel = ctx.getImageData(px, py, 1, 1).data
  return pixel[3] > threshold
}

interface UseHitTestOptions {
  canvasRef: React.RefObject<HTMLDivElement | null>
  assets: Asset[]
  zoom: number
  onHitAsset: (asset: Asset) => void
}

export const useHitTest = ({
  canvasRef,
  assets,
  zoom,
  onHitAsset,
}: UseHitTestOptions) => {
  const assetsRef = useRef(assets)
  assetsRef.current = assets

  const onHitAssetRef = useRef(onHitAsset)
  onHitAssetRef.current = onHitAsset

  const zoomRef = useRef(zoom)
  zoomRef.current = zoom

  const findAssetAtPoint = useCallback(
    async (clientX: number, clientY: number): Promise<Asset | null> => {
      const canvasEl = canvasRef.current
      if (!canvasEl) return null

      const rect = canvasEl.getBoundingClientRect()
      const canvasX = clientX - rect.left
      const canvasY = clientY - rect.top

      const currentAssets = assetsRef.current
      const currentZoom = zoomRef.current

      const sortedByLayerDesc = [...currentAssets].sort(
        (a, b) => b.layer - a.layer,
      )

      for (const asset of sortedByLayerDesc) {
        const scale = currentZoom * (asset.scale ?? 1)

        const assetLeftPx = (asset.xPercent / 100) * rect.width
        const assetTopPx = (asset.yPercent / 100) * rect.height

        const relX = (canvasX - assetLeftPx) / scale
        const relY = (canvasY - assetTopPx) / scale

        try {
          const img = await loadImage(asset.dataUrl)

          const maxDim = Math.min(200, rect.width * 0.4)
          const displayW = Math.min(img.naturalWidth, maxDim)
          const displayH = Math.min(img.naturalHeight, maxDim)

          const imgScaleX = img.naturalWidth / displayW
          const imgScaleY = img.naturalHeight / displayH

          if (relX < 0 || relY < 0 || relX > displayW || relY > displayH)
            continue

          const sampleX = relX * imgScaleX
          const sampleY = relY * imgScaleY

          if (isPixelOpaque(img, sampleX, sampleY)) {
            return asset
          }
        } catch {}
      }

      return null
    },
    [canvasRef],
  )

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-preload when assets change
  useEffect(() => {
    const preload = async () => {
      for (const asset of assetsRef.current) {
        try {
          await loadImage(asset.dataUrl)
        } catch {
          // ignore
        }
      }
    }
    preload()
  }, [assets])

  return { findAssetAtPoint }
}
