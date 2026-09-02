import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // Integra JSX, Fast Refresh y el compilador de React en Vite.
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
})
