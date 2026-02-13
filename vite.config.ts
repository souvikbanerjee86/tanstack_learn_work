import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import { fileURLToPath, URL } from 'url'

import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

const config = defineConfig({
  nitro: {
    noExternals: ['firebase-admin'],
    externals: {
      trace: [
        '@google-cloud/dialogflow-cx', 
        'google-gax'
      ]
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    devtools(),
    nitro({
      preset: 'node-server',
      noExternals: ['firebase-admin']
    }),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],

    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
  ssr: {
    external: ['@google-cloud/dialogflow-cx', 'google-gax'],
  },
  build: {
    rollupOptions: {
      output: {
        format: 'es',
        banner: `
          import { createRequire } from 'module';
          const require = createRequire(import.meta.url);
          import { fileURLToPath } from 'url';
          import { dirname } from 'path';
          const __filename = fileURLToPath(import.meta.url);
          const __dirname = dirname(__filename);
        `,
      },
    },
  },
})

export default config
