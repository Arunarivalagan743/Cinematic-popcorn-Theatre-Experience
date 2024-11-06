
// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react-swc';
// export default defineConfig({
//   server: {
//     proxy: {
//       '/api': {
//         target: 'http://localhost:6000',
//         secure: false,
//       },
//     },
//   },
//   plugins: [react()],
// });




import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
  },
  server: {
    // If using proxy
    proxy: {
      '/api': 'http://localhost:6000',
    },
  },
});
