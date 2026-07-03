import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import { queryClient } from '@/lib/queryClient'
import App from './App'
import '@/styles/globals.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#0F0F0F',
              color:      '#F9F7F3',
              fontFamily: 'Poppins, sans-serif',
              fontSize:   '13px',
              border:     '1px solid rgba(200,161,101,0.3)',
              borderRadius: '0',
            },
            success: { iconTheme: { primary: '#C8A165', secondary: '#0F0F0F' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </QueryClientProvider>
    </HelmetProvider>
  </StrictMode>,
)
