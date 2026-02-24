import { watch, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '@/stores/app'

export function usePageTitle() {
  const appStore = useAppStore()

  // 更新页面标题
  const updateTitle = (title?: string) => {
    if (title) {
      document.title = title
    } else {
      const siteTitle = appStore.getConfig('site_title', '星光小栈')
      document.title = siteTitle
    }
  }

  // 更新meta标签
  const updateMetaTags = () => {
    const description = appStore.getConfig('site_description', '个人技术博客')
    const keywords = appStore.getConfig('site_keywords', '博客,技术,分享')

    // 更新description
    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.setAttribute('name', 'description')
      document.head.appendChild(metaDesc)
    }
    metaDesc.setAttribute('content', description)

    // 更新keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]')
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta')
      metaKeywords.setAttribute('name', 'keywords')
      document.head.appendChild(metaKeywords)
    }
    metaKeywords.setAttribute('content', keywords)
  }

  // 更新favicon
  const updateFavicon = () => {
    const favicon = appStore.getConfig('site_favicon', '/favicon.ico')
    let link = document.querySelector('link[rel="icon"]')
    if (!link) {
      link = document.createElement('link')
      link.setAttribute('rel', 'icon')
      document.head.appendChild(link)
    }
    link.setAttribute('href', favicon)
  }

  // 处理页面可见性变化
  const handleVisibilityChange = () => {
    if (document.hidden) {
      // 页面不可见时
      const inactiveTitle = appStore.getConfig('site_tab_title_inactive', '(つ▂⊂)我走丢了')
      updateTitle(inactiveTitle)
    } else {
      // 页面可见时
      const activeTitle = appStore.getConfig('site_tab_title_active', '星光小栈')
      updateTitle(activeTitle)
    }
  }

  // 设置页面标题（用于路由切换时）
  const setPageTitle = (pageTitle?: string) => {
    const siteTitle = appStore.getConfig('site_title', '星光小栈')
    if (pageTitle) {
      updateTitle(`${pageTitle} - ${siteTitle}`)
    } else {
      updateTitle(siteTitle)
    }
  }

  onMounted(async () => {
    // 加载配置
    await appStore.loadSiteConfig()

    // 初始化标题、meta标签和favicon
    updateTitle()
    updateMetaTags()
    updateFavicon()

    // 监听页面可见性变化
    document.addEventListener('visibilitychange', handleVisibilityChange)
  })

  onUnmounted(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  })

  // 监听配置变化
  watch(() => appStore.siteConfig, () => {
    updateTitle()
    updateMetaTags()
    updateFavicon()
  }, { deep: true })

  return {
    updateTitle,
    setPageTitle,
    updateMetaTags
  }
}
