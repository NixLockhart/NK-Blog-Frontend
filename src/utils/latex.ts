import katex from 'katex'

/**
 * 转义正则表达式特殊字符
 */
export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * 渲染LaTeX公式
 * 使用占位符方式，避免Markdown渲染干扰
 * 使用@@符号包围，避免被markdown解析（_会被解析为斜体）
 */
export function processLatex(text: string): { content: string; formulas: Array<{ placeholder: string; rendered: string; type: 'block' | 'inline' }> } {
  const formulas: Array<{ placeholder: string; rendered: string; type: 'block' | 'inline' }> = []
  let counter = 0

  // 先处理块级公式 $$...$$
  let content = text.replace(/\$\$([\s\S]+?)\$\$/g, (_match, formula) => {
    const placeholder = `@@KATEXBLOCK${counter}@@`
    counter++
    try {
      const rendered = katex.renderToString(formula.trim(), {
        displayMode: true,
        throwOnError: false,
        errorColor: '#cc0000'
      })
      formulas.push({ placeholder, rendered, type: 'block' })
    } catch (e) {
      formulas.push({
        placeholder,
        rendered: `<div class="katex-error">公式渲染错误: ${formula}</div>`,
        type: 'block'
      })
    }
    return placeholder
  })

  // 再处理行内公式 $...$
  content = content.replace(/\$([^\$\n]+?)\$/g, (_match, formula) => {
    const placeholder = `@@KATEXINLINE${counter}@@`
    counter++
    try {
      const rendered = katex.renderToString(formula.trim(), {
        displayMode: false,
        throwOnError: false,
        errorColor: '#cc0000'
      })
      formulas.push({ placeholder, rendered, type: 'inline' })
    } catch (e) {
      formulas.push({
        placeholder,
        rendered: `<span class="katex-error">公式错误: ${formula}</span>`,
        type: 'inline'
      })
    }
    return placeholder
  })

  return { content, formulas }
}

/**
 * 恢复LaTeX渲染结果
 */
export function restoreLatex(html: string, formulas: Array<{ placeholder: string; rendered: string; type: 'block' | 'inline' }>): string {
  let result = html

  // 正序替换占位符
  for (const { placeholder, rendered, type } of formulas) {
    const escapedPlaceholder = escapeRegExp(placeholder)

    if (type === 'block') {
      // 块级公式：处理可能被markdown包裹在<p>标签中的情况
      // 先尝试替换被p标签包裹的情况
      const pWrappedPattern = new RegExp(`<p>\\s*${escapedPlaceholder}\\s*</p>`, 'g')
      result = result.replace(pWrappedPattern, `<div class="katex-display">${rendered}</div>`)

      // 再替换其他位置的占位符（如果没有被p标签包裹）
      const normalPattern = new RegExp(escapedPlaceholder, 'g')
      result = result.replace(normalPattern, `<div class="katex-display">${rendered}</div>`)
    } else {
      // 行内公式：直接替换
      const pattern = new RegExp(escapedPlaceholder, 'g')
      result = result.replace(pattern, rendered)
    }
  }

  return result
}
