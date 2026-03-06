import MarkdownIt from 'markdown-it'
import markdownItAnchor from 'markdown-it-anchor'
import hljs from 'highlight.js'
import DOMPurify from 'dompurify'
import { processLatex, restoreLatex } from '@/utils/latex'

// 创建markdown-it实例（用于文章）
const md: MarkdownIt = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true, // 支持换行
  highlight: function (str: string, lang: string): string {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code></pre>`
      } catch (__) {
        // Ignore errors
      }
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
  }
})

/**
 * 统一的标题 ID 生成函数
 */
function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[\s+]/g, '-')
    .replace(/[^\w\u4e00-\u9fa5\-]/g, '') // 保留中文、字母、数字、连字符
    .replace(/-+/g, '-') // 合并多个连字符
    .replace(/^-|-$/g, '') // 移除首尾连字符
}

// 添加锚点插件（仅用于文章）
md.use(markdownItAnchor, {
  slugify: slugify,
  permalink: markdownItAnchor.permalink.linkInsideHeader({
    symbol: '#',
    placement: 'before'
  })
})

// 创建简化的markdown-it实例（用于更新日志，无锚点）
const mdSimple: MarkdownIt = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
  highlight: function (str: string, lang: string): string {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code></pre>`
      } catch (__) {
        // Ignore errors
      }
    }
    return `<pre class="hljs"><code>${mdSimple.utils.escapeHtml(str)}</code></pre>`
  }
})

// 创建安全的markdown-it实例（用于用户生成内容：评论、留言）
// html: false 防止用户注入恶意 HTML/JS（XSS防护）
const mdSafe: MarkdownIt = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  breaks: true,
  highlight: function (str: string, lang: string): string {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code></pre>`
      } catch (__) {
        // Ignore errors
      }
    }
    return `<pre class="hljs"><code>${mdSafe.utils.escapeHtml(str)}</code></pre>`
  }
})

export function useMarkdown() {
  /**
   * 渲染Markdown为HTML（用于文章，包含锚点）
   */
  const renderMarkdown = (content: string): string => {
    if (!content) return ''

    // 步骤1：提取LaTeX公式并替换为占位符
    const { content: contentWithPlaceholders, formulas } = processLatex(content)

    // 步骤2：渲染Markdown
    const htmlWithPlaceholders = md.render(contentWithPlaceholders)

    // 步骤3：恢复LaTeX渲染结果
    let result = restoreLatex(htmlWithPlaceholders, formulas)

    // 步骤4：为表格添加滚动包装器
    result = result.replace(/<table>/g, '<div class="table-wrapper"><table>')
    result = result.replace(/<\/table>/g, '</table></div>')

    return DOMPurify.sanitize(result, {
      ADD_TAGS: ['iframe'],
      ADD_ATTR: ['target', 'rel', 'src', 'width', 'height', 'style', 'frameborder', 'allow', 'allowfullscreen', 'loading']
    })
  }

  /**
   * 渲染更新日志Markdown为HTML（简化版，无锚点）
   */
  const renderUpdateLog = (content: string): string => {
    if (!content) return ''

    // 步骤1：提取LaTeX公式并替换为占位符
    const { content: contentWithPlaceholders, formulas } = processLatex(content)

    // 步骤2：使用简化的Markdown渲染器（无锚点）
    const htmlWithPlaceholders = mdSimple.render(contentWithPlaceholders)

    // 步骤3：恢复LaTeX渲染结果
    let result = restoreLatex(htmlWithPlaceholders, formulas)

    // 步骤4：为表格添加滚动包装器
    result = result.replace(/<table>/g, '<div class="table-wrapper"><table>')
    result = result.replace(/<\/table>/g, '</table></div>')

    return DOMPurify.sanitize(result, {
      ADD_TAGS: ['iframe'],
      ADD_ATTR: ['target', 'rel', 'src', 'width', 'height', 'style', 'frameborder', 'allow', 'allowfullscreen', 'loading']
    })
  }

  /**
   * 从Markdown内容生成目录
   */
  const generateToc = (content: string): Array<{id: string, level: number, title: string}> => {
    if (!content) return []

    const headings: Array<{id: string, level: number, title: string}> = []
    // 用于追踪重复的ID
    const idCounts: Map<string, number> = new Map()
    // 兼容多种换行符格式: \r\n (Windows CRLF), \n (Unix LF), \r (Mac CR)
    const lines = content.split(/\r?\n|\r/)

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (!line) continue  // Skip undefined or empty lines
      // 匹配标题(h1-h3)
      const match = line.match(/^(#{1,3})\s+(.+)$/)
      if (match) {
        const level = match[1]?.length || 1
        const title = match[2]?.trim() || ''
        // 使用统一的 slugify 函数生成基础 id
        const baseId = slugify(title)

        // 处理重复ID：与 markdown-it-anchor 保持一致的后缀逻辑
        let id = baseId
        const count = idCounts.get(baseId) || 0
        if (count > 0) {
          id = `${baseId}-${count}`
        }
        idCounts.set(baseId, count + 1)

        headings.push({ id, level, title })
      }
    }

    return headings
  }

  /**
   * 渲染用户生成内容（评论、留言）为HTML
   * 使用 html: false 的安全实例，防止 XSS 注入
   */
  const renderUserContent = (content: string): string => {
    if (!content) return ''
    return mdSafe.render(content)
  }

  return {
    renderMarkdown,
    renderUpdateLog,
    renderUserContent,
    generateToc
  }
}
