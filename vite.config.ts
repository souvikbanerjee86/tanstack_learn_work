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
      noExternals: ['firebase-admin'],
      rollupConfig: {
        output: {
          format: 'es',
          banner: `
            import { createRequire as __createRequire } from 'module';
            import { fileURLToPath as __fileURLToPath } from 'url';
            import { dirname as __pathDirname } from 'path';
            
            const require = __createRequire(import.meta.url);
            const __filename = __fileURLToPath(import.meta.url);
            const __dirname = __pathDirname(__filename);
          `
        }
      }
    }),
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
  }
})

export default config
