import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

/**
 * Bootstrap | khởi tạo ứng dụng.
 * Mounts the React tree into the root element and keeps the entry file intentionally small.
 * Gắn cây React vào phần tử gốc của trang và giữ file khởi động ở mức tối giản.
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
