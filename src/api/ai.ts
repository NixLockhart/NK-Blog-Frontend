/**
 * AI助手API服务
 * 独立模块，处理与DIFY API的通信
 */

import { AI_CONFIG } from '@/config/ai'

export interface ChatEvent {
  event: string
  conversation_id?: string
  answer?: string
  message_id?: string
}

/**
 * 发送消息到AI助手（流式响应）
 */
export async function* sendMessage(
  query: string,
  conversationId?: string,
  user: string = AI_CONFIG.DEFAULT_USER
): AsyncGenerator<ChatEvent> {
  const response = await fetch(`${AI_CONFIG.API_BASE_URL}/chat-messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${AI_CONFIG.API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query,
      inputs: {},
      response_mode: 'streaming',
      user,
      conversation_id: conversationId || undefined,
      auto_generate_name: true
    })
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`)
  }

  const reader = response.body?.getReader()
  if (!reader) throw new Error('No reader')

  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6).trim()
        if (data) {
          try {
            yield JSON.parse(data)
          } catch {
            // 忽略解析错误
          }
        }
      }
    }
  }
}
