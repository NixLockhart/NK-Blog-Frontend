import request from '@/utils/request'
import type { Article, ArticleDetail, PageResult } from '@/types'

export const articleApi = {
  /**
   * 获取文章列表
   */
  getList(params: { page?: number; size?: number; categoryId?: number; keyword?: string }): Promise<PageResult<Article>> {
    return request.get('/articles', { params })
  },

  /**
   * 获取文章详情
   */
  getDetail(id: number): Promise<ArticleDetail> {
    return request.get(`/articles/${id}`)
  },

  /**
   * 获取热门文章
   */
  getHotArticles(limit: number = 10): Promise<Article[]> {
    return request.get('/articles/hot', { params: { limit } })
  },

  /**
   * 获取最新文章
   */
  getLatestArticles(limit: number = 5): Promise<Article[]> {
    return request.get('/articles/latest', { params: { limit } })
  },

  /**
   * 获取置顶文章
   */
  getTopArticles(): Promise<Article[]> {
    return request.get('/articles/top')
  },

  /**
   * 增加浏览量
   */
  incrementViews(id: number, visitorId: string): Promise<void> {
    return request.post(`/articles/${id}/view`, { visitorId })
  },

  /**
   * 点赞文章
   */
  likeArticle(id: number, visitorId: string): Promise<void> {
    return request.post(`/articles/${id}/like`, { visitorId })
  }
}
