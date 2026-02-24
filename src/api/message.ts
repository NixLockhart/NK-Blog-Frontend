import request from '@/utils/request'
import type { Message, MessageCreateRequest, PageResult } from '@/types'

export const messageApi = {
  /**
   * 获取留言列表
   */
  getList(params: { page?: number; size?: number }): Promise<PageResult<Message>> {
    return request.get('/messages', { params })
  },

  /**
   * 获取友情链接
   */
  getFriendLinks(): Promise<Message[]> {
    return request.get('/messages/friends')
  },

  /**
   * 发表留言
   */
  createMessage(data: MessageCreateRequest): Promise<void> {
    return request.post('/messages', data)
  }
}
