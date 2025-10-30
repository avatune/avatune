import theme from '@avatune/modern-cartoon-theme/react'
import { Avatar } from '@avatune/react'

const App = () => {
  return (
    <div className="content">
      <h1>Modern Cartoon Avatar Example</h1>
      <Avatar
        theme={theme}
        config={{
          body: 'shirt',
          ears: 'default',
          eyebrows: 'funny',
          eyes: 'dots',
          hair: 'short',
          head: 'oval',
          mouth: 'smile',
          noses: 'curve',
        }}
      />

      <h2>Random Avatar (tag-based)</h2>
      <Avatar
        theme={theme}
        config={{
          seed: 'random-seed-123',
        }}
      />
    </div>
  )
}

export default App
