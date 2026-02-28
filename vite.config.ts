import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { execSync } from 'child_process'

/**
 * 从 git tag 获取版本号
 * 工作流：git tag v2.0.5-alpha → vite build → __APP_VERSION__ 自动为 "v2.0.5-alpha"
 */
function getGitVersion(): string {
  try {
    return execSync('git describe --tags --abbrev=0').toString().trim()
  } catch {
    return 'unknown'
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue()
  ],
  define: {
    __APP_VERSION__: JSON.stringify(getGitVersion())
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 5173
    // 代理配置已移除: 现在所有请求都通过 VITE_BASE_URL 直接访问后端
    // 开发环境和生产环境使用统一的URL构造方式
  },
  build: {
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'markdown-vendor': ['markdown-it', 'highlight.js', 'katex'],
          'utils-vendor': ['axios', 'dayjs']
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: '[ext]/[name]-[hash].[ext]'
      }
    }
  }
})
