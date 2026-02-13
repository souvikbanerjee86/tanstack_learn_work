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
      external: [
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
      noExternals: ['firebase-admin','@google-cloud/dialogflow-cx', 'google-gax']
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
      external: ['@google-cloud/dialogflow-cx', 'google-gax'],
    },
  },
})

export default config
