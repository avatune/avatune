import { Short } from '@avatune/assets/react'
import type { AvatarConfig } from '@avatune/modern-cartoon'
import { renderAvatar } from '@avatune/modern-cartoon'

const config: AvatarConfig = {
  size: 800,
  backgroundColor: 'white',
  face: { shape: 'oval', skinTone: '#F6C7AC' },
  eyes: { style: 'dots', color: '#4A2E14' },
  mouth: { style: 'nervous', lipColor: 'white' },
  hair: { style: 'short', color: '#8B4513' },
  eyebrows: { style: 'funny' },
  clothing: { style: 'shirt', color: '#4A90E2' },
}

const App = () => {
  const svgString = renderAvatar(config)
  console.log('SVG String:', svgString)
  return (
    <div className="content">
      {/** biome-ignore lint/security/noDangerouslySetInnerHtml: TODO: fix this */}
      <div dangerouslySetInnerHTML={{ __html: svgString }} />
      {/* <Shirt style={{fill: 'white'}} /> */}
      <Short />
    </div>
  )
}

export default App
