import './output.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import LocalStorageProvider from './context/LocalStorageProvider.tsx'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LocalStorageProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <App />
    </LocalStorageProvider>
  </React.StrictMode>
)
