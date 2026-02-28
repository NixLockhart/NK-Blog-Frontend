// 通用类型定义
export interface Result<T = any> {
  code: number
  message: string
  data: T
  timestamp: number
}

export interface PageResult<T = any> {
  content: T[]
  total: number
  size: number
  page: number
  totalPages: number
}

// 主题相关类型
export interface Theme {
  id: number
  name: string
  slug: string
  description?: string
  author?: string
  version?: string
  themePath: string
  coverUrl?: string
  previewImageUrl?: string
  isApplied: boolean
  isDefault: boolean
  displayOrder: number
  createdAt: string
  updatedAt: string
}

// 文章相关类型
export interface Article {
  id: number
  title: string
  summary: string
  coverImage: string
  categoryId: number
  categoryName: string
  views: number
  likes: number
  commentCount: number
  isTop: number
  publishedAt: string
  createdAt: string
}

export interface ArticleDetail extends Article {
  content: string // 后端转换后的 HTML
  markdownContent: string // 原始 Markdown 内容
  toc: string
  updatedAt?: string
}

// 分类类型
export interface Category {
  id: number
  name: string
  slug: string
  description: string
  icon: string
  sortOrder: number
  articleCount: number
}

// 评论类型
export interface Comment {
  id: number
  articleId: number
  parentId: number | null
  nickname: string
  email?: string
  website?: string
  avatar?: string
  content: string
  status: number
  createdAt: string
  children?: Comment[]
}

export interface CommentCreateRequest {
  articleId: number
  parentId?: number
  nickname: string
  email?: string
  website?: string
  avatar?: string
  content: string
}

// 留言类型
export interface Message {
  id: number
  nickname: string
  email?: string
  blogUrl?: string
  avatar?: string
  content: string
  isFriendLink: number
  status: number
  createdAt: string
}

export interface MessageCreateRequest {
  nickname: string
  email?: string
  blogUrl?: string
  avatar?: string
  content: string
}

// 公告类型
export interface Announcement {
  id: number
  title: string
  content: string
  enabled: number
  startTime: string
  endTime: string
  createdAt: string
}

// 更新日志类型
export interface UpdateLog {
  id: number
  version: string
  title: string
  content: string
  contentHtml?: string
  isMajor: number  // 0=否, 1=是
  releaseDate: string
  createdAt: string
  isPending: boolean  // 是否待发布
}

// 网站配置类型
export interface SiteConfig {
  // 基本信息
  site_title: string
  site_subtitle: string
  site_keywords: string
  site_description: string
  site_author: string
  site_icp?: string
  site_gongan?: string
  site_favicon: string
  site_tab_title_active: string
  site_tab_title_inactive: string

  // 联系方式
  contact_email?: string
  contact_github?: string
  contact_weibo?: string
  contact_bilibili?: string
  contact_qq?: string

  // 主题设置
  theme_current: string
  theme_default_mode: string

  // 小部件配置
  widgets_enabled: string  // JSON字符串

  // 功能开关
  feature_comment_enabled: string  // "true"/"false" 字符串
  feature_message_enabled: string  // "true"/"false" 字符串
  feature_search_enabled: string   // "true"/"false" 字符串

  // AI助手
  ai_assistant?: string  // "true"/"false" 字符串
}
