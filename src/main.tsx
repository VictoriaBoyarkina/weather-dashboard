import './output.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import LocalStorageProvider from './context/LocalStorageProvider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LocalStorageProvider>
      <App />
    </LocalStorageProvider>
  </React.StrictMode>
)
