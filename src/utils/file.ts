import { FILE_BASE_URL } from '@/config/env'

/**
 * 文件URL处理工具
 */

/**
 * 获取完整的文件URL
 * @param path 相对路径,如 /images/covers/xxx.jpg 或 images/covers/xxx.jpg
 * @returns 完整的文件访问URL
 */
export function getFileUrl(path: string | null | undefined): string {
  if (!path) {
    return ''
  }

  // 如果已经是完整URL,直接返回
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  // 确保路径以 / 开头
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  // 如果已经包含 /files 前缀,直接拼接
  if (normalizedPath.startsWith('/files')) {
    return `${FILE_BASE_URL}${normalizedPath}`
  }

  // 否则添加 /files 前缀
  return `${FILE_BASE_URL}/files${normalizedPath}`
}

/**
 * 获取图片URL (封面、头像等)
 * @param path 相对路径
 * @returns 完整的图片访问URL
 */
export function getImageUrl(path: string | null | undefined): string {
  return getFileUrl(path)
}

/**
 * 获取头像URL,带默认头像
 * @param avatar 头像路径
 * @param defaultAvatar 默认头像URL
 * @returns 头像URL
 */
export function getAvatarUrl(avatar: string | null | undefined, defaultAvatar = '/default-avatar.png'): string {
  return avatar ? getFileUrl(avatar) : defaultAvatar
}
