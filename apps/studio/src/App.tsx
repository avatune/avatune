import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Studio } from './components/studio'
import { WelcomePage } from './components/welcome'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/studio/*" element={<Studio />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
