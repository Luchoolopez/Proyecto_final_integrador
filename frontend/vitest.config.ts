import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: false, // Sugerencia: cambiar a false por claridad
    environment: 'jsdom',
    setupFiles: './src/__tests__/setupTest.ts', // Añadí la extensión .ts
    
    // Sugerencia: Añadir configuración de cobertura
    coverage: {
      provider: 'v8', // o 'istanbul'
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'], // Asegúrate de incluir solo tus archivos fuente
      exclude: [ // Excluye archivos de configuración, main, etc.
        'src/main.tsx', 
        'src/vite-env.d.ts',
        'src/__tests__/**',
      ],
    },
  },
})