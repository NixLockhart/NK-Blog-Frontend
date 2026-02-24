import request from '@/utils/request'
import type { Comment, CommentCreateRequest } from '@/types'

export const commentApi = {
  /**
   * 获取文章评论列表(树形结构)
   */
  getArticleComments(articleId: number): Promise<Comment[]> {
    return request.get(`/comments/article/${articleId}`)
  },

  /**
   * 发表评论
   */
  createComment(data: CommentCreateRequest): Promise<void> {
    return request.post('/comments', data)
  }
}
