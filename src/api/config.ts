import request from '@/utils/request'
import type { SiteConfig, Announcement, UpdateLog } from '@/types'

export const configApi = {
  /**
   * 获取公开配置
   */
  getPublicConfig(): Promise<SiteConfig> {
    return request.get('/config/public')
  },

  /**
   * 获取网站基本信息
   */
  getSiteInfo(): Promise<Record<string, string>> {
    return request.get('/config/site-info')
  },

  /**
   * 获取当前公告
   */
  getActiveAnnouncement(): Promise<Announcement> {
    return request.get('/announcement/active')
  },

  /**
   * 获取所有当前公告（用于轮播）
   */
  getAllActiveAnnouncements(): Promise<Announcement[]> {
    return request.get('/announcements/active')
  },

  /**
   * 获取更新日志列表
   */
  getUpdateLogs(params?: { page?: number; size?: number }): Promise<UpdateLog[]> {
    return request.get('/update-logs', { params })
  },

  /**
   * 获取网站统计信息
   */
  getSiteStats(): Promise<{
    totalArticles: number
    totalCategories: number
    totalComments: number
    totalViews: number
    totalMessages: number
    totalLikes: number
    todayViews: number
    runningDays: number
    version: string
  }> {
    return request.get('/stats')
  },

  /**
   * 获取联系方式配置
   */
  getContactConfig(): Promise<Record<string, string>> {
    return request.get('/config/contact')
  },

  /**
   * 获取关注链接配置
   */
  getLinkConfig(): Promise<Record<string, string>> {
    return request.get('/config/link')
  }
}
