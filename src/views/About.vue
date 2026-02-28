<template>
  <div class="about-page">
    <div class="about-container">
      <div class="about-header">
        <div class="avatar">
          <img :src="avatarUrl" alt="Avatar" width="120" height="120" />
        </div>
        <h1 class="site-name">{{ siteConfig?.site_title || '星光小栈' }}</h1>
        <p class="site-slogan">{{ siteConfig?.site_description || '记录生活,分享知识' }}</p>
      </div>

      <div class="about-content">
        <section class="about-section">
          <h2 class="section-title">关于本站</h2>
          <p class="section-text">
            {{ aboutDescription }}
          </p>
        </section>

        <section class="about-section">
          <h2 class="section-title">技术栈</h2>
          <div class="tech-stack">
            <div class="tech-item">
              <h3>前端</h3>
              <p>Vue 3 + TypeScript + Vite</p>
            </div>
            <div class="tech-item">
              <h3>后端</h3>
              <p>Spring Boot + MySQL + Redis</p>
            </div>
            <div class="tech-item">
              <h3>部署</h3>
              <p>Docker + Nginx</p>
            </div>
          </div>
        </section>

        <section class="about-section">
          <h2 class="section-title">联系方式</h2>
          <div class="contact-links">
            <a v-if="siteConfig?.contact_email" :href="`mailto:${siteConfig.contact_email}`" class="contact-link">
              <Icon name="mail" :size="20" />
              Email
            </a>
            <a v-if="siteConfig?.contact_github" :href="siteConfig.contact_github" target="_blank" rel="noopener" class="contact-link">
              <Icon name="github" :size="20" />
              GitHub
            </a>
          </div>
        </section>

        <section class="about-section">
          <h2 class="section-title">统计信息</h2>
          <div class="stats">
            <div class="stat-item">
              <div class="stat-value">{{ stats.articleCount }}</div>
              <div class="stat-label">文章数</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ stats.categoryCount }}</div>
              <div class="stat-label">分类数</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ stats.commentCount }}</div>
              <div class="stat-label">评论数</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ stats.viewCount }}</div>
              <div class="stat-label">总访问</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores/app'
import { configApi } from '@/api/config'
import Icon from '@/components/common/Icon.vue'

const appStore = useAppStore()
const { siteConfig } = storeToRefs(appStore)

// 头像URL（使用相对路径，运行时由浏览器解析）
const avatarUrl = '/files/avatars/nk.jpg'

// 统计数据
const stats = ref({
  articleCount: 0,
  categoryCount: 0,
  commentCount: 0,
  viewCount: 0
})

// 关于本站的详细描述（响应式，随 siteConfig 更新自动变化）
const aboutDescription = computed(() => {
  return siteConfig.value?.site_description || '这是一个个人博客网站,记录学习、生活和思考。'
})

// 加载统计信息
const loadStats = async () => {
  try {
    const response = await configApi.getSiteStats()
    // 映射后端返回的数据到前端需要的字段
    stats.value = {
      articleCount: response.totalArticles || 0,
      categoryCount: response.totalCategories || 0,
      commentCount: response.totalComments || 0,
      viewCount: response.totalViews || 0
    }
  } catch (error) {
    console.error('加载统计信息失败:', error)
  }
}

onMounted(() => {
  loadStats()
})
</script>

<style scoped>
.about-page {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--spacing-sm) var(--spacing-xl) var(--spacing-xl);
}

.about-container {
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.about-header {
  text-align: center;
  padding: var(--spacing-xl);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
  color: #fff;
}

.avatar {
  width: 120px;
  height: 120px;
  margin: 0 auto var(--spacing-base);
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid rgba(255, 255, 255, 0.3);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.site-name {
  font-size: var(--text-3xl);
  font-weight: 700;
  margin: 0 0 var(--spacing-xs) 0;
}

.site-slogan {
  font-size: var(--text-lg);
  margin: 0;
  opacity: 0.9;
}

.about-content {
  padding: var(--spacing-xl);
}

.about-section {
  margin-bottom: var(--spacing-xl);
}

.about-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 var(--spacing-base) 0;
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--color-primary);
}

.section-text {
  color: var(--color-text-secondary);
  line-height: 1.8;
  margin: 0;
}

.tech-stack {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-base);
}

.tech-item {
  padding: var(--spacing-base);
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  text-align: center;
}

.tech-item h3 {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 var(--spacing-xs) 0;
}

.tech-item p {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

.contact-links {
  display: flex;
  gap: var(--spacing-base);
  flex-wrap: wrap;
}

.contact-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-base);
  background-color: var(--color-bg-secondary);
  color: var(--color-text);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: var(--transition-fast);
}

.contact-link:hover {
  background-color: var(--color-primary);
  color: #fff;
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-base);
}

.stat-item {
  text-align: center;
  padding: var(--spacing-base);
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-md);
}

.stat-value {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: var(--spacing-xs);
}

.stat-label {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

@media (max-width: 768px) {
  .about-page {
    padding: var(--spacing-base);
  }

  .tech-stack {
    grid-template-columns: 1fr;
  }

  .stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .contact-links {
    flex-direction: column;
  }
}
</style>
