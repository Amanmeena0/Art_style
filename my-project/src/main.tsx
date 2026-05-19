import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ClerkProvider } from '@clerk/clerk-react'

const ApiKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!ApiKey) {
  console.warn('Missing VITE_CLERK_PUBLISHABLE_KEY in .env file')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={ApiKey || ""} afterSignOutUrl="/">
      <App />
    </ClerkProvider>
  </StrictMode>,
)
