/**
 * AI助手配置
 * 独立模块，方便后期修改或移除
 */

// DIFY API 配置
export const AI_CONFIG = {
  // API基础URL（通过Nginx反向代理）
  API_BASE_URL: '/ai-api/v1',
  // API密钥
  API_KEY: 'app-xxxxxxxxxxxxxxxxxxxxxxxx',
  // 默认用户标识
  DEFAULT_USER: 'blog-visitor'
}
