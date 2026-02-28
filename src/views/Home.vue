<template>
  <div class="home-page">
    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 热门文章 -->
      <section v-if="hotLoading || hotArticles.length > 0" class="hot-articles section">
        <h2 class="section-title">热门文章</h2>
        <div v-if="hotLoading" class="hot-articles-grid">
          <ArticleCardSkeleton v-for="i in 3" :key="i" variant="overlay" />
        </div>
        <div v-else class="hot-articles-grid">
          <ArticleCard v-for="article in hotArticles" :key="article.id" :article="article" variant="overlay" />
        </div>
      </section>

      <!-- 最新文章 -->
      <section class="latest-articles section">
        <div class="section-header">
          <h2 class="section-title">最新文章</h2>
          <router-link to="/articles" class="more-link">查看更多 →</router-link>
        </div>

        <div v-if="loading" class="articles-grid">
          <ArticleCardSkeleton v-for="i in 6" :key="i" variant="overlay" />
        </div>
        <div v-else-if="articles.length === 0" class="empty-state">
          <p>暂无文章</p>
        </div>
        <div v-else class="articles-grid">
          <ArticleCard v-for="article in articles" :key="article.id" :article="article" variant="overlay" />
        </div>
      </section>
    </div>

    <!-- 侧边栏容器 -->
    <div class="sidebar-container">
      <aside class="sidebar">
        <!-- 动态加载的小工具 -->
        <div v-for="widget in appliedWidgets" :key="widget.id" class="widget">
          <DynamicWidget :widget="widget" />
        </div>

        <!-- 加载状态 -->
        <div v-if="widgetsLoading" class="widget">
          <SkeletonBlock width="100%" height="300px" rounded="var(--radius-lg)" />
          <div style="height: var(--spacing-lg)"></div>
          <SkeletonBlock width="100%" height="300px" rounded="var(--radius-lg)" />
        </div>

        <!-- 空状态提示 -->
        <div v-else-if="appliedWidgets.length === 0 && !widgetsLoading" class="widget">
          <div class="empty-state">
            <p>暂无小工具</p>
          </div>
        </div>

        <!-- 错误状态提示 -->
        <div v-if="widgetsError" class="widget">
          <div class="error-state">
            <p>{{ widgetsError }}</p>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { articleApi } from '@/api/article'
import { widgetApi } from '@/api/widget'
import type { Article } from '@/types'
import type { Widget } from '@/api/widget'
import ArticleCard from '@/components/article/ArticleCard.vue'
import DynamicWidget from '@/components/widgets/DynamicWidget.vue'
import ArticleCardSkeleton from '@/components/skeleton/ArticleCardSkeleton.vue'
import SkeletonBlock from '@/components/skeleton/SkeletonBlock.vue'

const articles = ref<Article[]>([])
const hotArticles = ref<Article[]>([])
const appliedWidgets = ref<Widget[]>([])
const loading = ref(false)
const hotLoading = ref(false)
const widgetsLoading = ref(false)
const widgetsError = ref('')

const loadArticles = async () => {
  loading.value = true
  try {
    const result = await articleApi.getList({ page: 0, size: 6 })
    articles.value = result.content
  } catch (error) {
    console.error('加载文章失败:', error)
  } finally {
    loading.value = false
  }
}

const loadHotArticles = async () => {
  hotLoading.value = true
  try {
    hotArticles.value = await articleApi.getHotArticles(3)
  } catch (error) {
    console.error('加载热门文章失败:', error)
  } finally {
    hotLoading.value = false
  }
}

const loadWidgets = async () => {
  widgetsLoading.value = true
  widgetsError.value = ''
  try {
    const widgets = await widgetApi.getAppliedWidgets()

    if (widgets && Array.isArray(widgets)) {
      appliedWidgets.value = widgets
    } else {
      widgetsError.value = `加载失败: 响应格式不正确`
      console.error('小工具API返回数据格式错误:', widgets)
    }
  } catch (error: any) {
    widgetsError.value = `加载小工具失败: ${error.message || '网络错误'}`
    console.error('加载小工具失败:', error)
  } finally {
    widgetsLoading.value = false
  }
}

onMounted(() => {
  loadArticles()
  loadHotArticles()
  loadWidgets()
})
</script>

<style scoped>
.home-page {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: var(--spacing-xl);
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 var(--spacing-xl) var(--spacing-sm);
  align-items: stretch;
}

.main-content {
  min-width: 0; /* 防止grid溢出 */
}

.sidebar-container {
  position: relative;
}

.section {
  margin-bottom: var(--spacing-xl);
}

.section:last-child {
  margin-bottom: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.section-title {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 var(--spacing-md) 0;
  position: relative;
  padding-left: var(--spacing-sm);
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 24px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  border-radius: 2px;
}

.more-link {
  color: var(--color-primary);
  text-decoration: none;
  font-size: var(--text-sm);
  font-weight: 500;
  transition: var(--transition-fast);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.more-link:hover {
  opacity: 0.8;
  transform: translateX(4px);
}

.hot-articles-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-base);
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-base);
}

.loading-state,
.empty-state,
.error-state {
  padding: var(--spacing-xl);
  text-align: center;
  color: var(--color-text-secondary);
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-state {
  color: var(--color-error-text);
  background-color: var(--color-error-bg);
  border: 1px solid var(--color-error-border);
}

.sidebar {
  position: sticky;
  top: calc(var(--header-height) + var(--spacing-base));
  max-height: calc(100vh - var(--header-height) - var(--spacing-lg));
  overflow-y: auto;
  padding-right: var(--spacing-sm);
}

/* 自定义滚动条样式 */
.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-sm);
}

.sidebar::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: var(--radius-sm);
  transition: background 0.2s ease;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: var(--color-primary);
}

/* Firefox 滚动条样式 */
.sidebar {
  scrollbar-width: thin;
  scrollbar-color: var(--color-border) var(--color-bg-secondary);
}

.widget {
  margin-bottom: var(--spacing-lg);
  animation: fadeInUp 0.5s ease-out;
}

.widget:last-child {
  margin-bottom: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.widget-title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 var(--spacing-base) 0;
}

@media (max-width: 1200px) {
  .home-page {
    grid-template-columns: 1fr 320px;
  }

  .hot-articles-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 1024px) {
  .home-page {
    grid-template-columns: 1fr;
  }

  .sidebar-container {
    width: 100%;
  }

  .sidebar {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-base);
    max-height: none;
    overflow-y: visible;
    padding-right: 0;
  }

  .widget {
    margin-bottom: 0;
  }

  .hot-articles-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .articles-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .home-page {
    padding: var(--spacing-base);
  }

  .sidebar {
    grid-template-columns: 1fr;
    gap: var(--spacing-base);
  }

  .hot-articles-grid {
    grid-template-columns: 1fr;
  }

  .section-title {
    font-size: var(--text-xl);
  }
}
</style>
