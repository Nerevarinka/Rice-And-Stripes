import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './component'
import { HashRouter } from 'react-router'

import "bootstrap-icons/font/bootstrap-icons.css";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
