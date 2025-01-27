
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  build: {
    sourcemap: true,},
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://mern-auth-movie.onrender.com',  // Make sure this matches your backend URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
// target: 'https://mern-auth-movie-api.onrender.com', target: 'https://mern-auth-movie-apii.onrender.com',