import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import 'tools-design-system/tokens.css'
import './app.css'
import './paper.css'
import { seedDemo } from './lib/demo'

const demo = new URLSearchParams(location.search).get('demo')
if (import.meta.env.DEV && demo !== null) seedDemo(demo)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
