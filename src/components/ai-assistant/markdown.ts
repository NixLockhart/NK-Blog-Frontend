/**
 * AI助手Markdown渲染工具
 * 复用博客现有的markdown-it配置，保持渲染效果一致
 */

import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import { processLatex, restoreLatex } from '@/utils/latex'

const md: MarkdownIt = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  breaks: true,
  highlight(str: string, lang: string): string {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code></pre>`
      } catch {
        // 忽略高亮错误
      }
    }
    return `<pre class="hljs"><code>${MarkdownIt().utils.escapeHtml(str)}</code></pre>`
  }
})

/**
 * 渲染Markdown内容为HTML
 */
export function renderMarkdown(content: string): string {
  if (!content) return ''

  // 步骤1：提取LaTeX公式并替换为占位符
  const { content: contentWithPlaceholders, formulas } = processLatex(content)

  // 步骤2：渲染Markdown
  const htmlWithPlaceholders = md.render(contentWithPlaceholders)

  // 步骤3：恢复LaTeX渲染结果
  return restoreLatex(htmlWithPlaceholders, formulas)
}

/**
 * 解析thinking标签，支持流式输出
 */
export function parseThinking(content: string): { thinking: string; answer: string } {
  // 检查闭合的 <think>...</think>
  const closedMatch = content.match(/<think>([\s\S]*?)<\/think>/)
  if (closedMatch && closedMatch[1]) {
    const thinking = closedMatch[1].trim()
    const answer = content.replace(/<think>[\s\S]*?<\/think>/, '').trim()
    return { thinking, answer }
  }

  // 检查闭合的 <thinking>...</thinking>
  const closedMatch2 = content.match(/<thinking>([\s\S]*?)<\/thinking>/)
  if (closedMatch2 && closedMatch2[1]) {
    const thinking = closedMatch2[1].trim()
    const answer = content.replace(/<thinking>[\s\S]*?<\/thinking>/, '').trim()
    return { thinking, answer }
  }

  // 检查未闭合的 <think> (流式输出中)
  const openIdx = content.indexOf('<think>')
  if (openIdx !== -1) {
    const thinking = content.slice(openIdx + 7).trim()
    const answer = content.slice(0, openIdx).trim()
    return { thinking, answer }
  }

  // 检查未闭合的 <thinking>
  const openIdx2 = content.indexOf('<thinking>')
  if (openIdx2 !== -1) {
    const thinking = content.slice(openIdx2 + 10).trim()
    const answer = content.slice(0, openIdx2).trim()
    return { thinking, answer }
  }

  return { thinking: '', answer: content }
}
