import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { SiteConfig, Announcement } from '@/types'
import { configApi } from '@/api/config'

export const useAppStore = defineStore('app', () => {
  const siteConfig = ref<SiteConfig | null>(null)
  const announcements = ref<Announcement[]>([])
  const loading = ref(false)
  const loaded = ref(false)

  /**
   * 加载网站配置（防重复加载）
   */
  async function loadSiteConfig() {
    if (loaded.value || loading.value) return
    loading.value = true
    try {
      siteConfig.value = await configApi.getPublicConfig()
      loaded.value = true
    } catch (error) {
      console.error('加载网站配置失败:', error)
    } finally {
      loading.value = false
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
    loadSiteConfig,
    loadAnnouncements,
    getConfig
  }
})
