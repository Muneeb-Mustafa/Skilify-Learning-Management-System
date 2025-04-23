// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })



import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        // Use the modern Sass API to avoid [legacy-js-api] warning
        api: 'modern',
        // Optional: Silence specific deprecation warnings (remove if you’ve fixed the Sass code)
        silenceDeprecations: [
          'import',          // For @import in _bootstrap.scss or dependencies
          'global-builtin',  // For Bootstrap’s global function calls
          'color-functions', // For Bootstrap’s old color functions
          'mixed-decls',     // For Bootstrap’s mixed declarations
        ],
        // Optional: Additional Sass options (e.g., include paths for imports)
        additionalData: `
          $warning: #FF0000; // Define global variables if needed
        `,
      },
    },
  },
});