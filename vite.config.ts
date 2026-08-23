import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: {
        // Bulma 1 and Buefy 3 still use if()/global built-ins that Dart Sass has
        // deprecated. These come from node_modules, not from our own styles, and
        // can only be fixed upstream, so quiet deps rather than the whole build:
        // warnings from src/**.scss are still reported.
        quietDeps: true,
        silenceDeprecations: ['if-function', 'global-builtin', 'import'],
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 8080,
  },
});
