// frontend/src/main.tsx
import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { SearchProvider } from './context/SearchContext'
import { ThemeProvider } from './context/ThemeContext'
import { CartProvider } from './context/CartContext'
import { CategoryProvider } from './context/CategoryContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={<div>Cargando...</div>}>
        <AuthProvider>
          <SearchProvider>
            <ThemeProvider>
              <CartProvider>
                <CategoryProvider>
                  <App />
                </CategoryProvider>
              </CartProvider>
            </ThemeProvider>
          </SearchProvider>
        </AuthProvider>
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
)