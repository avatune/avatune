import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

const rootEl = document.querySelector('#root')
if (!rootEl) throw new Error('Root element not found')

const root = createRoot(rootEl)
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)
