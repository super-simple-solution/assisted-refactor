import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ViteComponents from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from 'path'
import eslintPlugin from 'vite-plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      'vue': 'vue/dist/vue.esm-bundler.js',
      'vue-monaco-cdn': 'vue-monaco-cdn/dist/vue-monaco-cdn.umd.min.js'
    },
  },
  plugins: [
    vue(),
    ViteComponents({
      resolvers: [AntDesignVueResolver()]
    }),
    eslintPlugin({
      include: ['/src/**/*.vue', '/src/**/*.js']
    })
  ]
})
