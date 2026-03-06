import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { SiteConfig, Announcement } from '@/types'
import { configApi } from '@/api/config'

export const useAppStore = defineStore('app', () => {
  const siteConfig = ref<SiteConfig | null>(null)
  const announcements = ref<Announcement[]>([])
  const loading = ref(false)
  const loaded = ref(false)
  const backendDown = ref(false)

  /**
   * 判断是否为网络不可达错误（后端未启动）
   */
  function isNetworkError(error: any): boolean {
    if (!error) return false
    // axios 网络错误：无 response 且 code 为 ERR_NETWORK 或超时
    if (!error.response && (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED')) {
      return true
    }
    return false
  }

  /**
   * 加载网站配置（防重复加载）
   */
  async function loadSiteConfig() {
    if (loaded.value || loading.value) return
    loading.value = true
    try {
      siteConfig.value = await configApi.getPublicConfig()
      loaded.value = true
      backendDown.value = false
    } catch (error: any) {
      console.error('加载网站配置失败:', error)
      if (isNetworkError(error)) {
        backendDown.value = true
      }
    } finally {
      loading.value = false
    }
  }

  /**
   * 重新检测后端连通性
   */
  async function checkBackend() {
    loaded.value = false
    loading.value = false
    await loadSiteConfig()
    if (!backendDown.value) {
      loadAnnouncements()
    }
  }

  /**
   * 加载所有当前公告（用于轮播）
   */
  async function loadAnnouncements() {
    try {
      announcements.value = await configApi.getAllActiveAnnouncements()
    } catch (error) {
      console.error('加载公告失败:', error)
      announcements.value = []
    }
  }

  /**
   * 获取配置值（类型安全）
   */
  function getConfig(key: keyof SiteConfig, defaultValue: string = ''): string {
    if (!siteConfig.value) return defaultValue
    return siteConfig.value[key] || defaultValue
  }

  return {
    siteConfig,
    announcements,
    loading,
    backendDown,
    loadSiteConfig,
    loadAnnouncements,
    checkBackend,
    getConfig
  }
})
