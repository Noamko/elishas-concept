import { defineConfig } from 'vite'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  // כתובות יחסיות — האתר עובד גם תחת נתיב משנה (GitHub Pages) וגם בדומיין עצמאי
  base: './',
  server: {
    port: Number(process.env.PORT) || 5173,
    strictPort: true,
  },
  preview: {
    port: Number(process.env.PORT) || 4173,
  },
  build: {
    // ספריות נגן הווידאו (Mux + Media Chrome) גדולות, אבל נטענות רק בדף הקורס כשמוצג סרטון
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        bookConcept: resolve(__dirname, 'book-elishas-concept.html'),
        bookTmj: resolve(__dirname, 'book-tmj.html'),
        course: resolve(__dirname, 'course.html'),
      },
    },
  },
})
