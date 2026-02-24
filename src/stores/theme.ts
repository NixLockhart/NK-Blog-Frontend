import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getCurrentTheme, getThemeCss } from '@/api/theme'
import type { Theme as ThemeData } from '@/types'

export type ThemeMode = 'light' | 'dark'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<ThemeMode>('light')
  const isTransitioning = ref(false)
  const currentTheme = ref<ThemeData | null>(null)
  const themeStyleElement = ref<HTMLStyleElement | null>(null)

  /**
   * 初始化主题
   */
  async function initTheme() {
    // 1. 加载保存的主题模式（亮色/暗色）
    const savedTheme = localStorage.getItem('blog-theme') as ThemeMode
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      theme.value = savedTheme
    } else {
      // 根据系统偏好设置默认主题模式
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      theme.value = prefersDark ? 'dark' : 'light'
    }

    // 2. 从后端加载当前应用的主题
    try {
      const themeData = await getCurrentTheme()
      if (themeData) {
        currentTheme.value = themeData
        await loadThemeCss(themeData.themePath, theme.value)
      } else {
        // 如果没有应用主题，使用默认主题
        await loadDefaultTheme()
      }
    } catch (error) {
      console.error('加载主题失败，使用默认主题:', error)
      await loadDefaultTheme()
    }

    // 应用主题到html元素
    applyTheme(false)
  }

  /**
   * 加载默认主题
   */
  async function loadDefaultTheme() {
    currentTheme.value = {
      id: 0,
      name: '默认主题',
      slug: 'default',
      themePath: 'default',
      isApplied: true,
      isDefault: true,
      displayOrder: 1,
      createdAt: '',
      updatedAt: '',
      description: '',
      author: '',
      version: '',
      coverUrl: '',
      previewImageUrl: ''
    }
    await loadThemeCss('default', theme.value)
  }

  /**
   * 动态加载主题CSS
   */
  async function loadThemeCss(themePath: string, mode: ThemeMode) {
    try {
      const cssContent = await getThemeCss(themePath, mode)

      // 移除旧的主题样式
      if (themeStyleElement.value) {
        themeStyleElement.value.remove()
      }

      // 创建新的样式元素并注入
      // 使用 [data-theme='mode'] 选择器来确保CSS变量正确应用
      const wrappedCss = cssContent.replace(/:root/g, `[data-theme='${mode}']`)

      const styleEl = document.createElement('style')
      styleEl.id = 'dynamic-theme-style'
      styleEl.textContent = wrappedCss
      document.head.appendChild(styleEl)

      themeStyleElement.value = styleEl
    } catch (error) {
      console.error(`加载主题CSS失败 (${themePath}/${mode}):`, error)
      throw error
    }
  }

  /**
   * 应用主题到html元素
   */
  function applyTheme(animated: boolean = true) {
    if (animated) {
      isTransitioning.value = true
      document.documentElement.classList.add('theme-transition')
    }

    // 将data-theme属性设置到html元素上，确保全站应用
    document.documentElement.setAttribute('data-theme', theme.value)
    localStorage.setItem('blog-theme', theme.value)

    if (animated) {
      setTimeout(() => {
        isTransitioning.value = false
        document.documentElement.classList.remove('theme-transition')
      }, 300)
    }
  }

  /**
   * 切换主题模式（亮色/暗色）
   */
  async function toggleTheme() {
    const newMode = theme.value === 'light' ? 'dark' : 'light'
    theme.value = newMode

    // 重新加载当前主题的对应模式CSS
    if (currentTheme.value) {
      await loadThemeCss(currentTheme.value.themePath, newMode)
    }

    applyTheme(true)
  }

  /**
   * 设置主题模式
   */
  async function setTheme(newTheme: ThemeMode) {
    theme.value = newTheme

    // 重新加载当前主题的对应模式CSS
    if (currentTheme.value) {
      await loadThemeCss(currentTheme.value.themePath, newTheme)
    }

    applyTheme(true)
  }

  /**
   * 刷新当前主题（用于主题切换后重新加载）
   */
  async function refreshTheme() {
    try {
      const themeData = await getCurrentTheme()
      if (themeData) {
        currentTheme.value = themeData
        await loadThemeCss(themeData.themePath, theme.value)
      } else {
        await loadDefaultTheme()
      }
      applyTheme(false)
    } catch (error) {
      console.error('刷新主题失败:', error)
    }
  }

  return {
    theme,
    isTransitioning,
    currentTheme,
    initTheme,
    toggleTheme,
    setTheme,
    refreshTheme
  }
})
