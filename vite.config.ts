import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

// 路径查找
const pathResolve = (dir: string): string => {
  return resolve(__dirname, dir)
}
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [NaiveUiResolver()]
    }),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'pinia'
        // 'vue-i18n', '@vueuse/head', '@vueuse/core'
      ],
      //需要按需自动引入的依赖包
      dts: 'src/auto-import.d.ts'
      //选择auto-import.d.ts生成的位置'
    })
  ],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  resolve: {
    alias: {
      '@': pathResolve('./src'),
      hooks: pathResolve('./src/hooks'),
      components: pathResolve('./src/components'),
      api: pathResolve('./src/api'),
      assets: pathResolve('./src/assets'),
      constant: pathResolve('./src/constant'),
      utils: pathResolve('./src/utils'),
      router: pathResolve('./src/router'),
      store: pathResolve('./src/store'),
      views: pathResolve('./src/views')
    }
  },
  build: {
    outDir: './dist',
    emptyOutDir: true,
    target: 'esnext' // js格式
  }
})
