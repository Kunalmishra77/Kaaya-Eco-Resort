// d:/kaaya eco resort/client/src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'

import { store } from './store/index.js'
import App from './App.jsx'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '14px',
              borderRadius: '2px',
              background: '#1B4332',
              color: '#F5F0E8',
            },
            success: {
              iconTheme: { primary: '#C8A96E', secondary: '#1B4332' },
            },
            error: {
              iconTheme: { primary: '#C1440E', secondary: '#F5F0E8' },
              style: {
                background: '#C1440E',
                color: '#F5F0E8',
              },
            },
          }}
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
