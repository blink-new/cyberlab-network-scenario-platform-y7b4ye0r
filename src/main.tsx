import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from '@/components/ui/toaster'
import { ErrorBoundary } from './error-boundary'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
      <Toaster />
    </ErrorBoundary>
  </React.StrictMode>,
)