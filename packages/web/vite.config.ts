import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Custom domain - no base path needed
  resolve: {
    alias: {
      // Ensure browser version of core library is used
      '@owenbush/ableton-inspector-core/dist/src/browser.js': resolve(__dirname, '../core/dist/src/browser.js'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          motion: ['framer-motion'],
          core: ['@owenbush/ableton-inspector-core'],
        },
      },
    },
  },
});
