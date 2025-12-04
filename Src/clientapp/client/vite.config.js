import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    plugins: [react()],
    root: './',  // или оставить по умолчанию
    publicDir: '../public', // указываем на папку уровнем выше
    build: {
        outDir: 'dist',
    }
})