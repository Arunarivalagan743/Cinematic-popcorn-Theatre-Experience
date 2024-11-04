// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react-swc';


// export default defineConfig({
//   server: {
     
//     proxy: {
//       '/api': {
        
//         target: 'http://localhost:3000',
//         changeOrigin: true,
//       },
//     },
//   },
//   plugins: [react()],
// });
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Backend server
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  
  plugins: [react()],
});
