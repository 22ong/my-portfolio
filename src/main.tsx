import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App.tsx'

// 사이트가 GitHub Pages의 /my-portfolio/ 아래에 있으므로 주소를 그 경로 기준으로 해석함 (vite.config.ts base)
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
