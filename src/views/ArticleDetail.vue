<template>
  <div class="article-detail-page">
    <ArticleDetailSkeleton v-if="loading" />
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <router-link to="/" class="btn btn-primary">返回首页</router-link>
    </div>
    <div v-else-if="article" class="article-container">
      <!-- 文章内容 -->
      <article class="article-content">
        <!-- 文章头部 -->
        <header class="article-header">
          <h1 class="article-title">{{ article.title }}</h1>
          <div class="article-meta">
            <span class="meta-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {{ formatDate(article.publishedAt) }}
            </span>
            <span class="meta-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              {{ article.views }} 阅读
            </span>
            <span class="meta-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              {{ article.commentCount }} 评论
            </span>
            <router-link v-if="article.categoryName" :to="`/articles?categoryId=${article.categoryId}`" class="category-tag">
              {{ article.categoryName }}
            </router-link>
          </div>
        </header>

        <!-- 封面图 -->
        <div v-if="article.coverImage" class="article-cover">
          <img :src="getImageUrl(article.coverImage)" :alt="article.title" />
        </div>

        <!-- 文章正文 -->
        <div class="article-body markdown-body" v-html="renderedContent"></div>

        <!-- 文章操作 -->
        <div class="article-actions">
          <button class="action-btn like-btn" :class="{ liked: liked }" @click="handleLike">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <span>{{ article.likes }}</span>
          </button>
        </div>

        <!-- 评论区 -->
        <div class="comments-section">
          <CommentList :article-id="article.id" />
        </div>
      </article>

      <!-- 侧边栏 -->
      <aside class="article-sidebar">
        <!-- 目录 -->
        <ArticleToc v-if="toc.length > 0" :toc="toc" />
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { articleApi } from '@/api/article'
import type { ArticleDetail } from '@/types'
import { useMarkdown } from '@/composables/useMarkdown'
import { useVisitorId } from '@/composables/useVisitorId'
import { getImageUrl } from '@/utils/file'
import CommentList from '@/components/comment/CommentList.vue'
import ArticleToc from '@/components/article/ArticleToc.vue'
import ArticleDetailSkeleton from '@/components/skeleton/ArticleDetailSkeleton.vue'
import dayjs from 'dayjs'

const route = useRoute()
const { renderMarkdown, generateToc } = useMarkdown()
const { getVisitorId } = useVisitorId()

const article = ref<ArticleDetail | null>(null)
const loading = ref(false)
const error = ref<string>('')
const liked = ref(false)

const renderedContent = computed(() => {
  if (!article.value) return ''
  // 使用 markdownContent 而不是 content（content 已经是 HTML了）
  return renderMarkdown(article.value.markdownContent || article.value.content)
})

const toc = computed(() => {
  if (!article.value) return []
  // 使用 markdownContent 生成目录
  return generateToc(article.value.markdownContent || article.value.content)
})

const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

const loadArticle = async () => {
  const id = Number(route.params.id)
  if (isNaN(id)) {
    error.value = '文章ID无效'
    return
  }

  loading.value = true
  try {
    article.value = await articleApi.getDetail(id)
    // 增加浏览次数（fire-and-forget，不阻塞页面渲染）
    articleApi.incrementViews(id, getVisitorId())
  } catch (err: any) {
    console.error('加载文章失败:', err)
    error.value = err.message || '加载文章失败'
  } finally {
    loading.value = false
  }
}

const handleLike = async () => {
  if (!article.value || liked.value) return

  try {
    await articleApi.likeArticle(article.value.id, getVisitorId())
    article.value.likes++
    liked.value = true
    // 保存到 localStorage
    localStorage.setItem(`liked_article_${article.value.id}`, 'true')
  } catch (error) {
    console.error('点赞失败:', error)
  }
}

onMounted(() => {
  loadArticle()
  // 检查是否已点赞
  const id = Number(route.params.id)
  if (!isNaN(id)) {
    liked.value = localStorage.getItem(`liked_article_${id}`) === 'true'
  }
})
</script>

<style scoped>
.article-detail-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--spacing-sm) var(--spacing-xl) var(--spacing-xl);
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: var(--color-text-secondary);
}

.error-state p {
  margin-bottom: var(--spacing-base);
}

.article-container {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: var(--spacing-xl);
}

.article-content {
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  max-width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
}

.article-header {
  margin-bottom: var(--spacing-xl);
}

.article-title {
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 var(--spacing-base) 0;
  line-height: 1.3;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-base);
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
}

.category-tag {
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--color-bg-secondary);
  color: var(--color-primary);
  font-size: var(--text-xs);
  border-radius: var(--radius-sm);
  text-decoration: none;
  transition: var(--transition-fast);
}

.category-tag:hover {
  opacity: 0.8;
}

.article-cover {
  width: 100%;
  max-height: 500px;
  overflow: hidden;
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-xl);
  display: flex;
  justify-content: center;
  align-items: center;
}

.article-cover img {
  max-width: 100%;
  height: auto;
  max-height: 500px;
  object-fit: contain;
}

.article-body {
  margin-bottom: var(--spacing-xl);
}

.article-actions {
  display: flex;
  justify-content: center;
  padding: var(--spacing-lg) 0;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  margin-bottom: var(--spacing-xl);
}

.action-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-lg);
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  background-color: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: var(--transition-fast);
}

.action-btn:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.like-btn.liked {
  color: var(--color-accent);
  border-color: var(--color-accent);
}

.like-btn.liked svg {
  fill: var(--color-accent);
}

.article-sidebar {
  position: sticky;
  top: 96px; /* 导航栏高度64px + 间距32px */
  height: fit-content;
  align-self: start;
}

@media (max-width: 1024px) {
  .article-container {
    grid-template-columns: 1fr;
  }

  .article-sidebar {
    position: static;
  }
}

@media (max-width: 768px) {
  .article-detail-page {
    padding: 0 !important;
    max-width: 100vw;
    width: 100%;
    overflow-x: hidden;
    box-sizing: border-box;
  }

  .article-container {
    width: 100%;
    box-sizing: border-box;
  }

  .article-content {
    padding: var(--spacing-base) var(--spacing-sm) !important;
    max-width: 100%;
    width: 100%;
    margin: 0;
    box-sizing: border-box;
    border-radius: 0;
    border-left: none !important;
    border-right: none !important;
  }

  .article-title {
    font-size: var(--text-2xl);
    word-break: break-word;
  }

  /* 修复移动端内容超出问题 */
  .article-body {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
    box-sizing: border-box;
  }

  /* 确保 markdown-body 不超出 */
  .article-body :deep(.markdown-body) {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
    box-sizing: border-box;
  }

  /* 代码块防止超出 */
  .article-body :deep(.markdown-body pre) {
    max-width: 100%;
    overflow-x: auto;
    word-wrap: normal;
    white-space: pre;
  }

  .article-body :deep(.markdown-body code) {
    word-break: break-word;
    overflow-wrap: break-word;
  }

  /* 表格防止超出 */
  .article-body :deep(.markdown-body .table-wrapper) {
    max-width: 100%;
    overflow-x: auto;
  }

  .article-body :deep(.markdown-body table) {
    display: block;
    max-width: 100%;
    overflow-x: auto;
  }

  /* 图片防止超出 */
  .article-body :deep(.markdown-body img) {
    max-width: 100%;
    height: auto;
  }

  /* 长链接和长单词自动换行 */
  .article-body :deep(.markdown-body a) {
    word-break: break-all;
    overflow-wrap: break-word;
  }

  .article-body :deep(.markdown-body p),
  .article-body :deep(.markdown-body li) {
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  /* KaTeX 数学公式防止超出 */
  .article-body :deep(.markdown-body .katex-display) {
    max-width: 100%;
    overflow-x: auto;
  }
}
</style>
