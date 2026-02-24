<template>
  <div class="category-page">
    <div class="page-header">
      <h1 class="page-title">分类</h1>
      <p class="page-subtitle">探索不同主题的文章</p>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="loading"></div>
    </div>
    <div v-else-if="categories.length === 0" class="empty-state">
      <p>暂无分类</p>
    </div>
    <div v-else class="categories-grid">
      <router-link
        v-for="category in categories"
        :key="category.id"
        :to="`/articles?categoryId=${category.id}`"
        class="category-card"
      >
        <div class="category-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
        <h3 class="category-name">{{ category.name }}</h3>
        <p class="category-description">{{ category.description || '暂无描述' }}</p>
        <div class="category-count">{{ category.articleCount }} 篇文章</div>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { categoryApi } from '@/api/category'
import type { Category } from '@/types'

const categories = ref<Category[]>([])
const loading = ref(false)

const loadCategories = async () => {
  loading.value = true
  try {
    categories.value = await categoryApi.getList()
  } catch (error) {
    console.error('加载分类失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadCategories()
})
</script>

<style scoped>
.category-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-sm) var(--spacing-xl) var(--spacing-xl);
}

.page-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.page-title {
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 var(--spacing-xs) 0;
}

.page-subtitle {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  margin: 0;
}

.loading-state,
.empty-state {
  padding: var(--spacing-xl);
  text-align: center;
  color: var(--color-text-secondary);
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}

.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-xl);
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  text-decoration: none;
  transition: var(--transition-base);
}

.category-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);
  border-color: var(--color-primary);
}

.category-icon {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-full);
  margin-bottom: var(--spacing-base);
  color: var(--color-primary);
}

.category-name {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 var(--spacing-xs) 0;
  text-align: center;
}

.category-description {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  text-align: center;
  margin: 0 0 var(--spacing-base) 0;
  line-height: 1.5;
}

.category-count {
  font-size: var(--text-sm);
  color: var(--color-primary);
  font-weight: 600;
}

@media (max-width: 768px) {
  .category-page {
    padding: var(--spacing-base);
  }

  .categories-grid {
    grid-template-columns: 1fr;
  }
}
</style>
