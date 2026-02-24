/**
 * 访客ID管理
 */
export function useVisitorId() {
  const VISITOR_ID_KEY = 'blog_visitor_id'

  /**
   * 获取访客ID
   */
  const getVisitorId = (): string => {
    let visitorId = localStorage.getItem(VISITOR_ID_KEY)

    if (!visitorId) {
      // 生成新的访客ID
      visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
      localStorage.setItem(VISITOR_ID_KEY, visitorId)
    }

    return visitorId
  }

  return {
    getVisitorId
  }
}
