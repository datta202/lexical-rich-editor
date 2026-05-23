import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Root by default. Set VITE_BASE (e.g. "/lexical/") to match the subpath your
  // server serves the app from, so asset URLs resolve correctly.
  base: process.env.VITE_BASE ?? '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        // The standard editor, plus the collaborative demo (a two-pane page and
        // the single-editor instance it embeds in each pane).
        main: path.resolve(__dirname, 'index.html'),
        collab: path.resolve(__dirname, 'collab.html'),
        collabApp: path.resolve(__dirname, 'collab-app.html'),
      },
    },
  },
})
