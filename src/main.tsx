import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Authenticator } from './features/auth/Authenticator'
import { ToastProvider } from './components/Toast'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Authenticator>
      <ToastProvider>
        <App />
      </ToastProvider>
    </Authenticator>
  </StrictMode>,
)
