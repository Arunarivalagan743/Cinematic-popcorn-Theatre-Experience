
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  build: {
    sourcemap: true,},
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',  // Make sure this matches your backend URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
// target: 'https://mern-auth-movie-api.onrender.com', target: 'https://mern-auth-movie-apii.onrender.com',