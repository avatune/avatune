import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type {
  CategoryId,
  PaletteAssignments,
  PaletteConnections,
  PredictorMappings,
  ThemeFillBinding,
  ThemeFillBindings,
  ThemeFillTransform,
  ThemePalette,
} from '../types'
import { CATEGORIES } from '../types'
import type { StudioProject } from '../utils/studioProject'

export interface BuilderAsset {
  id: string
  category: CategoryId
  name: string
  /** Raw SVG markup, persisted to IndexedDB. */
  svg: string
  /** Object URL for the SVG blob, recreated each session. */
  url: string
  created: number
  /** Center X, as % of container width. */
  x: number
  /** Center Y, as % of container height. */
  y: number
  /** Rendered width, as % of container width. */
  scale: number
  rotation: number
  layer: number
  /** Fill attribute occurrences bound to primary or derived theme colors. */
  themeFillBindings: ThemeFillBindings
}

type StoredAsset = Omit<BuilderAsset, 'url' | 'themeFillBindings'> & {
  themeFillBindings?: Record<number, ThemeFillBinding | ThemeFillTransform>
  themeFillIndices?: number[]
}

const restoreThemeFillBindings = ({
  themeFillBindings,
  themeFillIndices,
}: Pick<
  StoredAsset,
  'themeFillBindings' | 'themeFillIndices'
>): ThemeFillBindings => {
  if (themeFillBindings) {
    return Object.fromEntries(
      Object.entries(themeFillBindings).map(([index, binding]) => [
        index,
        binding.type === 'primary' || binding.type === 'custom'
          ? binding
          : { type: 'custom', transforms: [binding] },
      ]),
    )
  }

  return Object.fromEntries(
    (themeFillIndices ?? []).map((index) => [
      index,
      { type: 'primary' as const },
    ]),
  )
}

export interface ContainerMeta {
  size: number
  radius: number
  clip: boolean
  themeName: string
  palettes: ThemePalette[]
  paletteByCategory: PaletteAssignments
  /** Categories that reuse another category's color instead of their own. */
  paletteConnections: PaletteConnections
  predictorMappings: PredictorMappings
  /** Categories that also offer a 'none' choice when generating an avatar. */
  optionalCategories: CategoryId[]
  previewColorByPalette: Record<string, string>
}

/** Default stacking order per category, tuned so a fresh avatar composes sensibly. */
const DEFAULT_Z: Record<CategoryId, number> = {
  head: 10,
  body: 5,
  neck: 8,
  ears: 12,
  hair: 40,
  eyes: 20,
  eyebrows: 22,
  mouth: 20,
  nose: 21,
  glasses: 45,
  faceHair: 25,
  accessories: 50,
  faceDetails: 15,
  forelock: 42,
  hats: 60,
}

const DEFAULT_PLACEMENT = { x: 50, y: 50, scale: 60, rotation: 0 }

const DEFAULT_PALETTES: ThemePalette[] = [
  {
    id: 'skin',
    name: 'Skin',
    colors: [
      { id: 'light', name: 'Light', value: '#FCBE93' },
      { id: 'medium', name: 'Medium', value: '#C78A5C' },
      { id: 'dark', name: 'Dark', value: '#80502E' },
      { id: 'very-light', name: 'Very light', value: '#FDCDAC' },
    ],
  },
  {
    id: 'background',
    name: 'Background',
    colors: [{ id: 'seashell', name: 'Seashell', value: '#FFEDEF' }],
  },
  {
    id: 'accent',
    name: 'Accent',
    colors: [
      { id: 'black', name: 'Black', value: '#000000' },
      { id: 'white', name: 'White', value: '#FFFFFF' },
      { id: 'lavender', name: 'Lavender', value: '#9287FF' },
      { id: 'sky', name: 'Sky', value: '#6BD9E9' },
      { id: 'salmon', name: 'Salmon', value: '#FC909F' },
      { id: 'canary', name: 'Canary', value: '#F4D150' },
    ],
  },
]

const DEFAULT_PALETTE_BY_CATEGORY: PaletteAssignments = {
  background: 'background',
  head: 'skin',
  ears: 'skin',
  neck: 'skin',
  hair: 'accent',
  faceHair: 'accent',
  eyes: 'accent',
  eyebrows: 'accent',
  mouth: 'accent',
  nose: 'accent',
  glasses: 'accent',
  body: 'accent',
  accessories: 'accent',
  faceDetails: 'accent',
  forelock: 'accent',
  hats: 'accent',
}

const DEFAULT_PALETTE_CONNECTIONS: PaletteConnections = {}

const DEFAULT_PREDICTOR_MAPPINGS: PredictorMappings = {}

const DEFAULT_OPTIONAL_CATEGORIES: CategoryId[] = CATEGORIES.filter(
  ({ optional }) => optional,
).map(({ id }) => id)

const DEFAULT_PREVIEW_COLOR_BY_PALETTE: Record<string, string> = {
  skin: 'light',
  background: 'seashell',
  accent: 'black',
}

const DEFAULT_META: ContainerMeta = {
  size: 560,
  radius: 50,
  clip: true,
  themeName: 'my-theme',
  palettes: DEFAULT_PALETTES,
  paletteByCategory: DEFAULT_PALETTE_BY_CATEGORY,
  paletteConnections: DEFAULT_PALETTE_CONNECTIONS,
  predictorMappings: DEFAULT_PREDICTOR_MAPPINGS,
  optionalCategories: DEFAULT_OPTIONAL_CATEGORIES,
  previewColorByPalette: DEFAULT_PREVIEW_COLOR_BY_PALETTE,
}

const DB_NAME = 'avatune-studio'
const STORE = 'assets'
const META_KEY = 'avatune-studio-meta-v2'

const round1 = (n: number) => Math.round(n * 10) / 10
const round2 = (n: number) => Math.round(n * 100) / 100
const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 7)

function openDb(): Promise<IDBDatabase> {
  const { promise, resolve, reject } = Promise.withResolvers<IDBDatabase>()
  const request = indexedDB.open(DB_NAME, 1)
  request.onupgradeneeded = () =>
    request.result.createObjectStore(STORE, { keyPath: 'id' })
  request.onsuccess = () => resolve(request.result)
  request.onerror = () => reject(request.error)
  return promise
}

const waitForTransaction = (transaction: IDBTransaction): Promise<void> => {
  const { promise, resolve, reject } = Promise.withResolvers<void>()
  transaction.oncomplete = () => resolve()
  transaction.onerror = () => reject(transaction.error)
  transaction.onabort = () => reject(transaction.error)
  return promise
}

const toObjectUrl = (svg: string) =>
  URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }))

export function useBuilder() {
  const [assets, setAssets] = useState<Record<string, BuilderAsset>>({})
  const [selCat, setSelCat] = useState<CategoryId>('head')
  const [selId, setSelId] = useState<string | null>(null)
  // The asset composed onto the stage for each category — preserved as the user
  // switches categories, so only the current category's pick is being edited.
  const [activeByCat, setActiveByCat] = useState<
    Partial<Record<CategoryId, string>>
  >({})
  const [meta, setMeta] = useState<ContainerMeta>(DEFAULT_META)
  const [dragging, setDragging] = useState(false)

  const dbRef = useRef<IDBDatabase | null>(null)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const dragRef = useRef<{ id: string; dx: number; dy: number } | null>(null)

  const selected = selId ? (assets[selId] ?? null) : null
  const selectedRef = useRef(selected)
  selectedRef.current = selected
  const assetsRef = useRef(assets)
  assetsRef.current = assets

  // --- persistence ------------------------------------------------------------
  useEffect(() => {
    openDb().then((db) => {
      dbRef.current = db
      const request = db.transaction(STORE).objectStore(STORE).getAll()
      request.onsuccess = () => {
        const loaded: Record<string, BuilderAsset> = {}
        for (const record of (request.result ?? []) as StoredAsset[]) {
          const { themeFillBindings, themeFillIndices, ...stored } = record
          loaded[record.id] = {
            ...stored,
            themeFillBindings: restoreThemeFillBindings({
              themeFillBindings,
              themeFillIndices,
            }),
            url: toObjectUrl(record.svg),
          }
        }
        setAssets(loaded)
      }
    })

    try {
      const raw = localStorage.getItem(META_KEY)
      if (raw) {
        const saved = JSON.parse(raw) as Partial<ContainerMeta>
        setMeta({
          ...DEFAULT_META,
          ...saved,
          palettes:
            Array.isArray(saved.palettes) && saved.palettes.length > 0
              ? saved.palettes
              : DEFAULT_PALETTES,
          // Replaced wholesale, not merged — a category the user set to "no
          // palette" has no key, and merging would silently restore its default.
          paletteByCategory:
            saved.paletteByCategory ?? DEFAULT_PALETTE_BY_CATEGORY,
          paletteConnections:
            saved.paletteConnections ?? DEFAULT_PALETTE_CONNECTIONS,
          predictorMappings:
            saved.predictorMappings ?? DEFAULT_PREDICTOR_MAPPINGS,
          optionalCategories:
            saved.optionalCategories ?? DEFAULT_OPTIONAL_CATEGORIES,
          previewColorByPalette: {
            ...DEFAULT_PREVIEW_COLOR_BY_PALETTE,
            ...saved.previewColorByPalette,
          },
        })
      }
    } catch {
      // ignore malformed meta
    }
  }, [])

  const dbPut = useCallback((asset: BuilderAsset) => {
    const { url: _url, ...record } = asset
    dbRef.current
      ?.transaction(STORE, 'readwrite')
      .objectStore(STORE)
      .put(record)
  }, [])

  const patchMeta = useCallback((patch: Partial<ContainerMeta>) => {
    setMeta((prev) => {
      const next = { ...prev, ...patch }
      try {
        localStorage.setItem(META_KEY, JSON.stringify(next))
      } catch {
        // ignore quota errors
      }
      return next
    })
  }, [])

  // --- asset mutations --------------------------------------------------------
  const updateAsset = useCallback(
    (id: string, patch: Partial<BuilderAsset>) => {
      setAssets((prev) => {
        const current = prev[id]
        if (!current) return prev
        const next = { ...current, ...patch }
        const svg = patch.svg
        if (svg !== undefined && svg !== current.svg) {
          URL.revokeObjectURL(current.url)
          next.url = toObjectUrl(svg)
        }
        dbPut(next)
        return { ...prev, [id]: next }
      })
    },
    [dbPut],
  )

  const addAsset = useCallback(
    (svg: string, name: string) => {
      const id = uid()
      const asset: BuilderAsset = {
        id,
        category: selCat,
        name,
        svg,
        url: toObjectUrl(svg),
        created: Date.now(),
        ...DEFAULT_PLACEMENT,
        themeFillBindings: {},
        layer: DEFAULT_Z[selCat] ?? 30,
      }
      dbPut(asset)
      setAssets((prev) => ({ ...prev, [id]: asset }))
      setSelId(id)
      setActiveByCat((prev) => ({ ...prev, [selCat]: id }))
    },
    [selCat, dbPut],
  )

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      for (const file of Array.from(files)) {
        addAsset(await file.text(), file.name.replace(/\.svg$/i, ''))
      }
    },
    [addAsset],
  )

  const pasteSvg = useCallback(
    (svg: string) => {
      const title = svg.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim()
      const count = Object.values(assets).filter(
        (asset) => asset.category === selCat,
      ).length
      addAsset(svg, title || `pasted-${count + 1}`)
    },
    [addAsset, assets, selCat],
  )

  const importProject = useCallback(async (project: StudioProject) => {
    const db = dbRef.current ?? (await openDb())
    dbRef.current = db
    const transaction = db.transaction(STORE, 'readwrite')
    const store = transaction.objectStore(STORE)
    store.clear()
    for (const asset of project.assets) store.put(asset)
    await waitForTransaction(transaction)

    const importedAssets = Object.fromEntries(
      project.assets.map((asset) => [
        asset.id,
        { ...asset, url: toObjectUrl(asset.svg) },
      ]),
    )
    setAssets((current) => {
      for (const asset of Object.values(current)) {
        URL.revokeObjectURL(asset.url)
      }
      return importedAssets
    })
    setMeta(project.meta)
    try {
      localStorage.setItem(META_KEY, JSON.stringify(project.meta))
    } catch {
      // ignore quota errors
    }
    setActiveByCat({})
    const selectedAsset =
      project.assets.find((asset) => asset.category === 'head') ??
      project.assets[0]
    setSelCat(selectedAsset?.category ?? 'head')
    setSelId(selectedAsset?.id ?? null)
  }, [])

  const clearProject = useCallback(async () => {
    const db = dbRef.current ?? (await openDb())
    dbRef.current = db
    const transaction = db.transaction(STORE, 'readwrite')
    transaction.objectStore(STORE).clear()
    await waitForTransaction(transaction)

    setAssets((current) => {
      for (const asset of Object.values(current)) {
        URL.revokeObjectURL(asset.url)
      }
      return {}
    })
    setMeta(DEFAULT_META)
    try {
      localStorage.removeItem(META_KEY)
    } catch {
      // ignore storage errors
    }
    setActiveByCat({})
    setSelCat('head')
    setSelId(null)
  }, [])

  const removeAsset = useCallback((id: string) => {
    setAssets((prev) => {
      const current = prev[id]
      if (current) URL.revokeObjectURL(current.url)
      dbRef.current
        ?.transaction(STORE, 'readwrite')
        .objectStore(STORE)
        .delete(id)
      const next = { ...prev }
      delete next[id]
      return next
    })
    setSelId((prev) => (prev === id ? null : prev))
    setActiveByCat((prev) => {
      const entry = Object.entries(prev).find(([, aid]) => aid === id)
      if (!entry) return prev
      const next = { ...prev }
      delete next[entry[0] as CategoryId]
      return next
    })
  }, [])

  const selectAsset = useCallback((id: string) => {
    const asset = assetsRef.current[id]
    setSelId(id)
    if (asset) setActiveByCat((prev) => ({ ...prev, [asset.category]: id }))
    stageRef.current?.focus()
  }, [])

  const selectCategory = useCallback(
    (category: CategoryId) => {
      setSelCat(category)
      // Re-select this category's preserved pick, or focus its last asset the
      // first time it is opened.
      const activeId = activeByCat[category]
      const inCategory = Object.values(assets)
        .filter((asset) => asset.category === category)
        .sort((a, b) => a.created - b.created)
      const chosen =
        activeId && assets[activeId]?.category === category
          ? assets[activeId]
          : inCategory[inCategory.length - 1]
      setSelId(chosen ? chosen.id : null)
      if (chosen) {
        setActiveByCat((prev) => ({ ...prev, [category]: chosen.id }))
        stageRef.current?.focus()
      }
    },
    [assets, activeByCat],
  )

  const resetPlacement = useCallback(() => {
    const asset = selectedRef.current
    if (!asset) return
    updateAsset(asset.id, {
      ...DEFAULT_PLACEMENT,
      layer: DEFAULT_Z[asset.category] ?? 30,
    })
  }, [updateAsset])

  // Copies another asset's placement (position, scale, rotation, layer) onto
  // the current selection.
  const inheritFrom = useCallback(
    (sourceId: string) => {
      const target = selectedRef.current
      const source = assetsRef.current[sourceId]
      if (!target || !source || source.id === target.id) return
      updateAsset(target.id, {
        x: source.x,
        y: source.y,
        scale: source.scale,
        rotation: source.rotation,
        layer: source.layer,
      })
    },
    [updateAsset],
  )

  // Bulk placement edit, scoped to one category when given, otherwise to every
  // asset in the project.
  const transformAssets = useCallback(
    (
      fn: (asset: BuilderAsset) => Partial<BuilderAsset>,
      category?: CategoryId,
    ) => {
      setAssets((prev) => {
        const next = { ...prev }
        for (const asset of Object.values(prev)) {
          if (category && asset.category !== category) continue
          const patched = { ...asset, ...fn(asset) }
          dbPut(patched)
          next[asset.id] = patched
        }
        return next
      })
    },
    [dbPut],
  )

  const moveAssets = useCallback(
    (dx: number, dy: number, category?: CategoryId) => {
      transformAssets(
        (asset) => ({
          x: round2(asset.x + dx),
          y: round2(asset.y + dy),
        }),
        category,
      )
    },
    [transformAssets],
  )

  // Scales assets about the container center so the avatar grows or shrinks as
  // one group.
  const scaleAssets = useCallback(
    (factor: number, category?: CategoryId) => {
      transformAssets(
        (asset) => ({
          x: round2(50 + (asset.x - 50) * factor),
          y: round2(50 + (asset.y - 50) * factor),
          scale: Math.max(1, round1(asset.scale * factor)),
        }),
        category,
      )
    },
    [transformAssets],
  )

  // --- stage interaction ------------------------------------------------------
  const clientToPct = useCallback((clientX: number, clientY: number) => {
    const rect = stageRef.current?.getBoundingClientRect()
    if (!rect) return { x: 0, y: 0 }
    return {
      x: ((clientX - rect.left) / rect.width) * 100,
      y: ((clientY - rect.top) / rect.height) * 100,
    }
  }, [])

  const onStageMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const asset = selectedRef.current
      if (!asset) return
      e.preventDefault()
      stageRef.current?.focus()
      const p = clientToPct(e.clientX, e.clientY)
      dragRef.current = { id: asset.id, dx: p.x - asset.x, dy: p.y - asset.y }
      setDragging(true)
    },
    [clientToPct],
  )

  const onStageKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const asset = selectedRef.current
      if (!asset) return
      const step = e.shiftKey ? 5 : 0.5
      switch (e.key) {
        case 'ArrowLeft':
          updateAsset(asset.id, { x: round2(asset.x - step) })
          break
        case 'ArrowRight':
          updateAsset(asset.id, { x: round2(asset.x + step) })
          break
        case 'ArrowUp':
          updateAsset(asset.id, { y: round2(asset.y - step) })
          break
        case 'ArrowDown':
          updateAsset(asset.id, { y: round2(asset.y + step) })
          break
        default:
          return
      }
      e.preventDefault()
    },
    [updateAsset],
  )

  // Drag move/end on window so the pointer can leave the stage mid-drag.
  useEffect(() => {
    const move = (e: MouseEvent) => {
      const drag = dragRef.current
      if (!drag) return
      const p = clientToPct(e.clientX, e.clientY)
      updateAsset(drag.id, {
        x: round2(p.x - drag.dx),
        y: round2(p.y - drag.dy),
      })
    }
    const up = () => {
      if (!dragRef.current) return
      dragRef.current = null
      setDragging(false)
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', up)
    }
  }, [clientToPct, updateAsset])

  // Native non-passive wheel listener so we can preventDefault while scaling.
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      const asset = selectedRef.current
      if (!asset) return
      e.preventDefault()
      const delta = (e.deltaY < 0 ? 1 : -1) * (e.shiftKey ? 5 : 1)
      updateAsset(asset.id, { scale: Math.max(1, round1(asset.scale + delta)) })
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [updateAsset])

  // Each category's preserved pick (falling back to its first asset), so
  // switching categories never drops the assets composed for the others.
  const visibleLayers = useMemo(() => {
    const byCat: Partial<Record<CategoryId, BuilderAsset>> = {}
    const ordered = Object.values(assets).sort((a, b) => a.created - b.created)
    for (const asset of ordered) byCat[asset.category] ??= asset
    for (const [category, id] of Object.entries(activeByCat)) {
      const chosen = id ? assets[id] : undefined
      if (chosen) byCat[category as CategoryId] = chosen
    }
    return Object.values(byCat) as BuilderAsset[]
  }, [assets, activeByCat])

  return {
    assets,
    selCat,
    selectCategory,
    selId,
    selected,
    selectAsset,
    meta,
    patchMeta,
    uploadFiles,
    pasteSvg,
    removeAsset,
    importProject,
    clearProject,
    updateAsset,
    resetPlacement,
    inheritFrom,
    moveAssets,
    scaleAssets,
    visibleLayers,
    dragging,
    stageRef,
    onStageMouseDown,
    onStageKeyDown,
  }
}

export type Builder = ReturnType<typeof useBuilder>
