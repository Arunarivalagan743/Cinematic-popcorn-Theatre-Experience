
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  build: {
    sourcemap: true,},
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://cinematic-popcorn-theatre-experience.onrender.com',  // Make sure this matches your backend URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
