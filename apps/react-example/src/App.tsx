import { Avatar } from '@avatune/react'
import theme from '@avatune/sketch-black-white-theme/react'

const App = () => {
  return (
    <div className="content">
      <h2>Custom Avatar Example</h2>
      <Avatar
        theme={theme}
        ears="round"
        eyebrows="bold"
        eyes="standard"
        hair="star"
        head="oval"
        mouth="smirk"
        noses="sharp"
      />

      <h2>Random Avatar (tag-based)</h2>
      <Avatar theme={theme} seed="random-seed-123" />
    </div>
  )
}

export default App
