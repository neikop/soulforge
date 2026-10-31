import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 600,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'react-vendor',
              test: /node_modules\/(?:react|react-dom|react-router)/,
            },
            {
              name: 'chakra-vendor',
              test: /node_modules\/(?:@ark-ui|@chakra-ui|@emotion|@zag-js)/,
            },
            {
              name: 'form-vendor',
              test: /node_modules\/(?:react-hook-form|react-number-format|react-select)/,
            },
          ],
        },
      },
    },
  },
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    port: 3000,
    strictPort: true,
  },
})
