import request from '@/utils/request'
import { FILE_BASE_URL } from '@/config/env'
import type { Theme } from '@/types'

/**
 * 获取当前应用的主题
 */
export function getCurrentTheme(): Promise<Theme | null> {
  return request.get<Theme | null>('/theme/current')
}

/**
 * 获取主题CSS文件内容
 * @param themePath 主题路径
 * @param mode 'light' 或 'dark'
 */
export async function getThemeCss(themePath: string, mode: 'light' | 'dark'): Promise<string> {
  const url = `${FILE_BASE_URL}/files/themes/${themePath}/${mode}.css`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`加载主题CSS失败: ${mode}`)
  }
  return await response.text()
}

export const themeApi = {
  getCurrentTheme,
  getThemeCss
}
