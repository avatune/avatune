import { reactTheme } from '@avatune/modern-cartoon-theme/react'
import { Avatar } from '@avatune/react'
import type { AvatarConfig } from '@avatune/types'

const config: AvatarConfig = {
  parts: {
    body: 'shirt',
    ears: 'default',
    eyebrows: 'funny',
    eyes: 'dots',
    hair: 'short',
    head: 'oval',
    mouth: 'smile',
    noses: 'curve',
  },
}

const App = () => {
  return (
    <div className="content">
      <h1>Modern Cartoon Avatar Example</h1>
      <Avatar theme={reactTheme} config={config} width={400} height={400} />

      <h2>Random Avatar (tag-based)</h2>
      <Avatar
        theme={reactTheme}
        config={{
          seed: 'random-seed-123',
        }}
        width={400}
        height={400}
      />
    </div>
  )
}

export default App
