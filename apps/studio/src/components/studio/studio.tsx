import type { ChangeEvent } from 'react'
import { useRef, useState } from 'react'
import { useBuilder } from '../../hooks/use-builder'
import { parseStudioProject } from '../../utils/studioProject'
import { CategoryPanel } from './category-panel'
import { Inspector } from './inspector'
import { Stage } from './stage'
import { exportStudioProject } from './theme-export'

const sanitizeName = (raw: string): string =>
  raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'my-theme'

export const Studio = () => {
  const builder = useBuilder()
  const { assets, meta, patchMeta, importProject, clearProject } = builder
  const [exporting, setExporting] = useState(false)
  const [importing, setImporting] = useState(false)
  const importInputRef = useRef<HTMLInputElement | null>(null)
  const busy = importing || exporting

  const handleClear = async () => {
    if (
      !window.confirm(
        'Clear the whole Studio project? Every asset, palette and placement is deleted. This cannot be undone.',
      )
    ) {
      return
    }
    try {
      await clearProject()
    } catch (error) {
      console.error('Studio clear failed:', error)
      window.alert('Clear failed. Check the console for details.')
    }
  }

  const handleExport = async () => {
    const all = Object.values(assets)
    if (!all.some((asset) => asset.category === 'head')) {
      window.alert('Add at least one Head asset before exporting.')
      return
    }
    const input = window.prompt('Theme name', meta.themeName)
    if (input === null) return
    const themeName = sanitizeName(input)
    patchMeta({ themeName })

    setExporting(true)
    try {
      exportStudioProject(all, meta, themeName)
    } catch (error) {
      console.error('Theme export failed:', error)
      window.alert('Export failed. Check the console for details.')
    } finally {
      setExporting(false)
    }
  }

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0]
    event.currentTarget.value = ''
    if (!file) return

    setImporting(true)
    try {
      const parsed = parseStudioProject(JSON.parse(await file.text()))
      if (!parsed.ok) {
        window.alert(parsed.error)
        return
      }
      if (
        Object.keys(assets).length > 0 &&
        !window.confirm('Replace the current Studio project with this file?')
      ) {
        return
      }
      await importProject(parsed.project)
    } catch (error) {
      console.error('Studio import failed:', error)
      window.alert('Import failed. Select a valid Avatune Studio JSON file.')
    } finally {
      setImporting(false)
    }
  }

  return (
    <div
      style={{
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '14px 28px',
          background: '#ffffff',
          borderBottom: '1px solid #e8e5df',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <img
            src="/favicon.png"
            alt=""
            width={22}
            height={22}
            style={{ borderRadius: 5 }}
          />
          <span
            style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}
          >
            Avatune
          </span>
        </div>
        <div style={{ fontSize: 12, color: '#8a867e' }}>
          Upload assets → position &amp; scale → export JSON
        </div>
        <div style={{ flex: 1 }} />
        <input
          ref={importInputRef}
          type="file"
          accept=".json,application/json"
          onChange={(event) => void handleImport(event)}
          style={{ display: 'none' }}
        />
        <button
          type="button"
          className="chip-btn"
          onClick={() => void handleClear()}
          disabled={busy}
        >
          Clear
        </button>
        <button
          type="button"
          className="chip-btn"
          onClick={() => importInputRef.current?.click()}
          disabled={busy}
        >
          {importing ? 'Importing…' : 'Import'}
        </button>
        <button
          type="button"
          className="btn-dark"
          onClick={() => void handleExport()}
          disabled={busy}
        >
          {exporting ? 'Exporting…' : 'Export'}
        </button>
      </header>

      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '300px 1fr 300px',
          minHeight: 0,
        }}
      >
        <CategoryPanel builder={builder} />
        <Stage builder={builder} />
        <Inspector builder={builder} />
      </div>
    </div>
  )
}
