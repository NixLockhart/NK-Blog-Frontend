/**
 * 环境配置统一管理
 *
 * 所有环境变量的访问都应该通过这个文件进行
 * 这样可以确保配置的一致性，便于维护和部署
 *
 * 环境变量配置说明：
 * - VITE_BASE_URL: 后端服务器基础URL
 *   - 开发环境: http://localhost:8080
 *   - 生产环境: 空字符串（使用相对路径，前后端同域部署）或完整域名
 * - VITE_API_BASE_URL: API路径前缀，默认为 /api
 * - VITE_APP_TITLE: 应用标题
 */

/**
 * 后端API基础URL
 * 用于所有API请求
 * 格式: {VITE_BASE_URL}{VITE_API_BASE_URL}
 * 示例: http://localhost:8080/api 或 /api
 */
export const API_BASE_URL = (import.meta.env.VITE_BASE_URL || '') + (import.meta.env.VITE_API_BASE_URL || '/api')

/**
 * 文件资源基础URL
 * 用于访问图片、小工具等静态资源
 * 这些资源通过后端的 /files 接口提供
 * 格式: {VITE_BASE_URL}
 * 示例: http://localhost:8080 或 空字符串（相对路径）
 */
export const FILE_BASE_URL = import.meta.env.VITE_BASE_URL || ''

/**
 * 应用标题
 */
export const APP_TITLE = import.meta.env.VITE_APP_TITLE || '星光小栈'

/**
 * 开发模式
 */
export const IS_DEV = import.meta.env.DEV

/**
 * 生产模式
 */
export const IS_PROD = import.meta.env.PROD

/**
 * 应用版本号
 * 构建时从 git tag 自动注入
 * 工作流：git tag v2.0.5-alpha → vite build → APP_VERSION = "v2.0.5-alpha"
 */
declare const __APP_VERSION__: string
export const APP_VERSION = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'unknown'
