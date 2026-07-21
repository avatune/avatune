import { useState } from 'react'
import { useBuilder } from '../../hooks/use-builder'
import { CategoryPanel } from './category-panel'
import { Inspector } from './inspector'
import { Stage } from './stage'
import { exportTheme } from './theme-export'

const sanitizeName = (raw: string): string =>
  raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'my-theme'

export const Studio = () => {
  const builder = useBuilder()
  const { assets, meta, patchMeta } = builder
  const [exporting, setExporting] = useState(false)

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
      await exportTheme(all, meta, themeName)
    } catch (error) {
      console.error('Theme export failed:', error)
      window.alert('Export failed. Check the console for details.')
    } finally {
      setExporting(false)
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
          Upload assets → position &amp; scale → export config
        </div>
        <div style={{ flex: 1 }} />
        <button
          type="button"
          className="btn-dark"
          onClick={() => void handleExport()}
          disabled={exporting}
        >
          {exporting ? 'Exporting…' : 'Export'}
        </button>
      </header>

      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '280px 1fr 300px',
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
