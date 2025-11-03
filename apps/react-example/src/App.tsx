import { Avatar } from '@avatune/react'
import theme from '@avatune/sketch-black-white-theme/react'

const App = () => {
  return (
    <div className="content">
      <h2>Modern Cartoon Avatar Example</h2>
      <Avatar
        theme={theme}
        ears="standard"
        eyebrows="sharp"
        eyes="sharp"
        hair="rocket"
        head="oval"
        mouth="lips"
        noses="sharp"
      />

      <h2>Random Avatar (tag-based)</h2>
      <Avatar theme={theme} seed="random-seed-123" />
    </div>
  )
}

export default App
