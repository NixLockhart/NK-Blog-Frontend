import request from '@/utils/request'
import type { Category } from '@/types'

export const categoryApi = {
  /**
   * 获取所有分类
   */
  getList(): Promise<Category[]> {
    return request.get('/categories')
  },

  /**
   * 获取分类详情
   */
  getDetail(id: number): Promise<Category> {
    return request.get(`/categories/${id}`)
  }
}
