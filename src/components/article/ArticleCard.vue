<template>
  <article class="article-card">
    <router-link :to="`/article/${article.id}`" class="article-link">
      <!-- 封面图 -->
      <div v-if="article.coverImage" class="article-cover">
        <img :src="getImageUrl(article.coverImage)" :alt="article.title" loading="lazy" @error="handleImageError" />
        <div v-if="article.isTop" class="top-badge">置顶</div>
      </div>

      <!-- 文章内容 -->
      <div class="article-body">
        <h3 class="article-title">{{ article.title }}</h3>
        <p class="article-summary">{{ article.summary }}</p>

        <!-- 元信息 -->
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
          <span v-if="article.categoryName" class="category-tag">
            {{ article.categoryName }}
          </span>
        </div>
      </div>
    </router-link>
  </article>
</template>

<script setup lang="ts">
import type { Article } from '@/types'
import dayjs from 'dayjs'
import { getImageUrl } from '@/utils/file'

defineProps<{
  article: Article
}>()

const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD')
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.parentElement?.style.setProperty('display', 'none')
}
</script>

<style scoped>
.article-card {
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: var(--transition-base);
}

.article-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.article-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.article-cover {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.article-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: var(--transition-base);
}

.article-card:hover .article-cover img {
  transform: scale(1.05);
}

.top-badge {
  position: absolute;
  top: var(--spacing-base);
  right: var(--spacing-base);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--color-accent);
  color: #fff;
  font-size: var(--text-xs);
  font-weight: 600;
  border-radius: var(--radius-sm);
}

.article-body {
  padding: var(--spacing-md);
}

.article-title {
  font-size: var(--text-xl);
  font-weight: 600;
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--color-text);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.article-summary {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0 0 var(--spacing-base) 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
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
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
}

.category-tag {
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--color-bg-secondary);
  color: var(--color-primary);
  font-size: var(--text-xs);
  border-radius: var(--radius-sm);
}
</style>
