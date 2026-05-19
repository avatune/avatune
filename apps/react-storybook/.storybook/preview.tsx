import type { Decorator, Preview } from '@storybook/react-vite'
import type { CSSProperties } from 'react'

const getAvatarSvg = () =>
  document.querySelector<SVGSVGElement>('svg[aria-label="Avatar"]')

const triggerDownload = (href: string, filename: string) => {
  const a = document.createElement('a')
  a.href = href
  a.download = filename
  a.click()
  URL.revokeObjectURL(href)
}

const downloadAvatarPng = () => {
  const svg = getAvatarSvg()
  if (!svg) return

  const size = Number(svg.getAttribute('width')) || 400
  const xml = new XMLSerializer().serializeToString(svg)
  const svgUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`

  const img = new Image()
  img.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    canvas.getContext('2d')?.drawImage(img, 0, 0, size, size)
    canvas.toBlob((blob) => {
      if (!blob) return
      triggerDownload(URL.createObjectURL(blob), `avatar-${Date.now()}.png`)
    }, 'image/png')
  }
  img.src = svgUrl
}

const downloadAvatarSvg = () => {
  const svg = getAvatarSvg()
  if (!svg) return

  const xml = new XMLSerializer().serializeToString(svg)
  const blob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' })
  triggerDownload(URL.createObjectURL(blob), `avatar-${Date.now()}.svg`)
}

const buttonStyle: CSSProperties = {
  padding: '8px 16px',
  fontSize: 14,
  fontWeight: 500,
  background: '#1ea7fd',
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer',
}

const withDownload: Decorator = (Story) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16,
    }}
  >
    <Story />
    <div style={{ display: 'flex', gap: 8 }}>
      <button type="button" onClick={downloadAvatarPng} style={buttonStyle}>
        Download PNG
      </button>
      <button type="button" onClick={downloadAvatarSvg} style={buttonStyle}>
        Download SVG
      </button>
    </div>
  </div>
)

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [withDownload],
}

export default preview
