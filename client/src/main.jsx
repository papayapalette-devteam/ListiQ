import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './styles/index.css'

// STEP 5C — Set up React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,    // 10 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (error) => {
        // Global error handling for mutations if needed
        console.error('Mutation Error:', error);
      }
    }
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e293b',
            color: '#fff',
            borderRadius: '10px',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#f26522',
              secondary: '#fff',
            },
          },
        }}
      />
    </QueryClientProvider>
  </React.StrictMode>,
)
