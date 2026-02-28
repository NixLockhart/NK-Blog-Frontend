<template>
  <!-- Overlay 布局：杂志覆盖式 -->
  <article v-if="variant === 'overlay'" class="article-card card-overlay">
    <router-link :to="`/article/${article.id}`" class="article-link">
      <div class="overlay-image" :class="{ 'no-cover': !article.coverImage }">
        <img v-if="article.coverImage" :src="getImageUrl(article.coverImage)" :alt="article.title" loading="lazy" @error="handleImageError" />
        <div v-if="article.isTop" class="overlay-badge">置顶</div>
      </div>
      <div class="overlay-content">
        <span v-if="article.categoryName" class="overlay-category">{{ article.categoryName }}</span>
        <h3 class="overlay-title">{{ article.title }}</h3>
        <div class="overlay-meta">
          <span class="meta-item">
            <Icon name="calendar" :size="13" />
            {{ formatDate(article.publishedAt) }}
          </span>
          <span class="meta-item">
            <Icon name="eye" :size="13" />
            {{ article.views }}
          </span>
        </div>
      </div>
    </router-link>
  </article>

  <!-- Horizontal 布局：横向列表式 -->
  <article v-else-if="variant === 'horizontal'" class="article-card card-horizontal">
    <router-link :to="`/article/${article.id}`" class="article-link">
      <div v-if="article.coverImage" class="horizontal-cover">
        <img :src="getImageUrl(article.coverImage)" :alt="article.title" loading="lazy" @error="handleImageError" />
        <div v-if="article.isTop" class="top-badge">置顶</div>
      </div>
      <div class="horizontal-body">
        <div v-if="article.isTop && !article.coverImage" class="top-badge-inline">置顶</div>
        <h3 class="horizontal-title">{{ article.title }}</h3>
        <p class="horizontal-summary">{{ article.summary }}</p>
        <div class="horizontal-meta">
          <span class="meta-item">
            <Icon name="calendar" :size="14" />
            {{ formatDate(article.publishedAt) }}
          </span>
          <span class="meta-item">
            <Icon name="eye" :size="14" />
            {{ article.views }} 阅读
          </span>
          <span class="meta-item">
            <Icon name="comment" :size="14" />
            {{ article.commentCount }} 评论
          </span>
          <span v-if="article.categoryName" class="category-tag">
            {{ article.categoryName }}
          </span>
        </div>
      </div>
    </router-link>
  </article>

  <!-- Vertical 布局：经典纵向（默认） -->
  <article v-else class="article-card card-vertical">
    <router-link :to="`/article/${article.id}`" class="article-link">
      <div v-if="article.coverImage" class="article-cover">
        <img :src="getImageUrl(article.coverImage)" :alt="article.title" loading="lazy" @error="handleImageError" />
        <div v-if="article.isTop" class="top-badge">置顶</div>
      </div>
      <div class="article-body">
        <h3 class="article-title">{{ article.title }}</h3>
        <p class="article-summary">{{ article.summary }}</p>
        <div class="article-meta">
          <span class="meta-item">
            <Icon name="calendar" :size="14" />
            {{ formatDate(article.publishedAt) }}
          </span>
          <span class="meta-item">
            <Icon name="eye" :size="14" />
            {{ article.views }} 阅读
          </span>
          <span class="meta-item">
            <Icon name="comment" :size="14" />
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
import Icon from '@/components/common/Icon.vue'

withDefaults(defineProps<{
  article: Article
  variant?: 'vertical' | 'overlay' | 'horizontal'
}>(), {
  variant: 'vertical'
})

const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD')
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.parentElement?.style.setProperty('display', 'none')
}
</script>

<style scoped>
/* ==================== 共用 ==================== */
.article-card {
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: var(--transition-base);
}

.article-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: var(--text-xs);
}

.top-badge {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--color-accent);
  color: #fff;
  font-size: var(--text-xs);
  font-weight: 600;
  border-radius: var(--radius-sm);
}

.category-tag {
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--color-bg-secondary);
  color: var(--color-primary);
  font-size: var(--text-xs);
  border-radius: var(--radius-sm);
}

/* ==================== Vertical（默认） ==================== */
.card-vertical {
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
}

.card-vertical:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.article-cover {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.article-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: var(--transition-base);
}

.card-vertical:hover .article-cover img {
  transform: scale(1.05);
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

.card-vertical .meta-item {
  color: var(--color-text-tertiary);
}

/* ==================== Overlay（杂志覆盖式） ==================== */
.card-overlay {
  position: relative;
  aspect-ratio: 16 / 9;
  cursor: pointer;
}

.card-overlay:hover {
  box-shadow: var(--shadow-xl);
  transform: translateY(-3px);
}

.card-overlay .article-link {
  position: relative;
  width: 100%;
  height: 100%;
}

.overlay-image {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.overlay-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.card-overlay:hover .overlay-image img {
  transform: scale(1.08);
}

/* 无封面图时的渐变兜底 */
.overlay-image.no-cover {
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
}

.overlay-badge {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--color-accent);
  color: #fff;
  font-size: var(--text-xs);
  font-weight: 600;
  border-radius: var(--radius-sm);
  z-index: 2;
}

.overlay-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: var(--spacing-xl) var(--spacing-md) var(--spacing-md);
  background: linear-gradient(to top, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.3) 60%, transparent 100%);
  z-index: 1;
  transition: background 0.3s ease;
}

.card-overlay:hover .overlay-content {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.4) 60%, transparent 100%);
}

.overlay-category {
  display: inline-block;
  padding: 2px var(--spacing-sm);
  background-color: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.9);
  font-size: var(--text-xs);
  border-radius: var(--radius-sm);
  margin-bottom: var(--spacing-xs);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.overlay-title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: #fff;
  margin: 0 0 var(--spacing-xs) 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.overlay-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.overlay-meta .meta-item {
  color: rgba(255, 255, 255, 0.75);
}

/* ==================== Horizontal（横向列表式） ==================== */
.card-horizontal {
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
}

.card-horizontal:hover {
  box-shadow: var(--shadow-lg);
  border-color: var(--color-border-hover);
}

.card-horizontal .article-link {
  display: flex;
  flex-direction: row;
}

.horizontal-cover {
  position: relative;
  width: 240px;
  flex-shrink: 0;
  aspect-ratio: 4 / 3;
  overflow: hidden;
}

.horizontal-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: var(--transition-base);
}

.card-horizontal:hover .horizontal-cover img {
  transform: scale(1.05);
}

.horizontal-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: var(--spacing-md) var(--spacing-lg);
}

.top-badge-inline {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--color-accent);
  color: #fff;
  font-size: var(--text-xs);
  font-weight: 600;
  border-radius: var(--radius-sm);
  margin-bottom: var(--spacing-sm);
  width: fit-content;
}

.horizontal-title {
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

.horizontal-summary {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0 0 var(--spacing-base) 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.horizontal-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-base);
  flex-wrap: wrap;
  margin-top: auto;
}

.card-horizontal .meta-item {
  color: var(--color-text-tertiary);
}

/* ==================== 响应式 ==================== */
@media (max-width: 768px) {
  /* Horizontal 在移动端堆叠为纵向 */
  .card-horizontal .article-link {
    flex-direction: column;
  }

  .horizontal-cover {
    width: 100%;
    aspect-ratio: 16 / 9;
  }

  .horizontal-body {
    padding: var(--spacing-base);
  }

  .horizontal-title {
    font-size: var(--text-lg);
  }

  /* Overlay 移动端字号调整 */
  .overlay-title {
    font-size: var(--text-base);
  }
}
</style>
