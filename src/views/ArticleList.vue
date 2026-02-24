<template>
  <div class="article-list-page">
    <div class="page-header">
      <h1 class="page-title">{{ pageTitle }}</h1>
      <span class="page-header-decoration"></span>
      <p v-if="searchKeyword" class="page-subtitle">
        搜索 "{{ searchKeyword }}" 的结果，共 {{ pagination.total }} 篇文章
      </p>
      <p v-else class="page-subtitle">共 {{ pagination.total }} 篇文章</p>
    </div>

    <!-- 分类筛选 -->
    <div v-if="categories.length > 0" class="category-filter">
      <button
        class="category-btn"
        :class="{ active: !currentCategoryId }"
        @click="filterByCategory(null)"
      >
        全部
      </button>
      <button
        v-for="category in categories"
        :key="category.id"
        class="category-btn"
        :class="{ active: currentCategoryId === category.id }"
        @click="filterByCategory(category.id)"
      >
        {{ category.name }} ({{ category.articleCount }})
      </button>
    </div>

    <!-- 文章列表 -->
    <div v-if="loading" class="articles-grid">
      <ArticleCardSkeleton v-for="i in 12" :key="i" />
    </div>
    <div v-else-if="articles.length === 0" class="empty-state">
      <p v-if="searchKeyword">没有找到你想看的哦(´・ω・`)</p>
      <p v-else>暂无文章</p>
    </div>
    <div v-else class="articles-grid">
      <ArticleCard v-for="article in articles" :key="article.id" :article="article" />
    </div>

    <!-- 分页 -->
    <div v-if="pagination.total > pagination.pageSize" class="pagination">
      <button
        class="pagination-btn"
        :disabled="pagination.current === 1"
        @click="loadPage(pagination.current - 1)"
      >
        上一页
      </button>
      <div class="pagination-pages">
        <template v-for="page in displayPages" :key="page">
          <span v-if="page === -1" class="pagination-ellipsis">...</span>
          <button
            v-else
            class="pagination-btn"
            :class="{ active: page === pagination.current }"
            @click="loadPage(page)"
          >
            {{ page }}
          </button>
        </template>
      </div>
      <button
        class="pagination-btn"
        :disabled="pagination.current === totalPages"
        @click="loadPage(pagination.current + 1)"
      >
        下一页
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { articleApi } from '@/api/article'
import { categoryApi } from '@/api/category'
import type { Article, Category } from '@/types'
import ArticleCard from '@/components/article/ArticleCard.vue'
import ArticleCardSkeleton from '@/components/skeleton/ArticleCardSkeleton.vue'

const route = useRoute()

const articles = ref<Article[]>([])
const categories = ref<Category[]>([])
const loading = ref(false)
const currentCategoryId = ref<number | null>(null)
const searchKeyword = ref<string>('')
const pagination = ref({
  current: 1,
  pageSize: 12,
  total: 0
})

const pageTitle = computed(() => {
  if (searchKeyword.value) {
    return '搜索结果'
  }
  if (currentCategoryId.value) {
    const category = categories.value.find(c => c.id === currentCategoryId.value)
    return category ? category.name : '文章列表'
  }
  return '全部文章'
})

const totalPages = computed(() => Math.ceil(pagination.value.total / pagination.value.pageSize))

const displayPages = computed(() => {
  const current = pagination.value.current
  const total = totalPages.value
  const pages: number[] = []

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push(-1) // 省略号
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push(-1)
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push(-1)
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push(-1)
      pages.push(total)
    }
  }

  return pages
})

const loadArticles = async () => {
  loading.value = true
  try {
    const result = await articleApi.getList({
      page: pagination.value.current - 1,
      size: pagination.value.pageSize,
      categoryId: currentCategoryId.value || undefined,
      keyword: searchKeyword.value || undefined
    })
    articles.value = result.content
    pagination.value.total = result.total
  } catch (error) {
    console.error('加载文章失败:', error)
  } finally {
    loading.value = false
  }
}

const loadCategories = async () => {
  try {
    categories.value = await categoryApi.getList()
  } catch (error) {
    console.error('加载分类失败:', error)
  }
}

const filterByCategory = (categoryId: number | null) => {
  currentCategoryId.value = categoryId
  pagination.value.current = 1
  loadArticles()
}

const loadPage = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  pagination.value.current = page
  loadArticles()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 监听路由参数变化（含初始加载）
watch(
  () => ({ categoryId: route.query.categoryId, search: route.query.search }),
  (newQuery) => {
    currentCategoryId.value = newQuery.categoryId ? Number(newQuery.categoryId) : null
    searchKeyword.value = (newQuery.search as string) || ''
    pagination.value.current = 1
    loadArticles()
  },
  { immediate: true }
)

onMounted(() => {
  loadCategories()
})
</script>

<style scoped>
.article-list-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-sm) var(--spacing-xl) var(--spacing-xl);
}

.page-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
  padding-bottom: var(--spacing-lg);
}

.page-title {
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 var(--spacing-sm) 0;
  letter-spacing: 0.02em;
}

.page-header-decoration {
  display: block;
  width: 40px;
  height: 3px;
  margin: 0 auto var(--spacing-sm);
  border-radius: var(--radius-full);
  background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
}

.page-subtitle {
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
  margin: 0;
  letter-spacing: 0.04em;
}

.category-filter {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xl);
  justify-content: center;
}

.category-btn {
  padding: var(--spacing-xs) var(--spacing-base);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: var(--transition-fast);
}

.category-btn:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.category-btn.active {
  color: #fff;
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.loading-state,
.empty-state {
  padding: var(--spacing-xl);
  text-align: center;
  color: var(--color-text-secondary);
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-xl);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-xl);
}

.pagination-pages {
  display: flex;
  gap: var(--spacing-xs);
}

.pagination-btn {
  min-width: 36px;
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--text-sm);
  color: var(--color-text);
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: var(--transition-fast);
}

.pagination-btn:hover:not(:disabled):not(.active) {
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.pagination-btn.active {
  color: #fff;
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-ellipsis {
  min-width: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
  user-select: none;
}

@media (max-width: 768px) {
  .article-list-page {
    padding: var(--spacing-base);
  }

  .articles-grid {
    grid-template-columns: 1fr;
  }

  .pagination-pages {
    display: none;
  }
}
</style>
