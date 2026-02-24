import request from '@/utils/request'
import { FILE_BASE_URL } from '@/config/env'

export interface Widget {
  id: number
  name: string
  codePath: string
  coverUrl?: string
  isApplied: boolean
  isSystem: boolean
  displayOrder: number
  createdAt: string
  updatedAt: string
}

/**
 * 获取已应用的小工具列表
 */
export function getAppliedWidgets(): Promise<Widget[]> {
  return request.get<Widget[]>('/widgets')
}

/**
 * 获取小工具HTML代码（用于动态渲染）
 */
export async function getWidgetHtml(codePath: string): Promise<string> {
  const url = `${FILE_BASE_URL}/files/gadgets/${codePath}`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('加载小工具失败')
  }
  return await response.text()
}

export const widgetApi = {
  getAppliedWidgets,
  getWidgetHtml
}
