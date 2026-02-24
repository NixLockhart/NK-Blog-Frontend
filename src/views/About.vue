<template>
  <div class="about-page">
    <div class="about-container">
      <div class="about-header">
        <div class="avatar">
          <img :src="avatarUrl" alt="Avatar" />
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
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              Email
            </a>
            <a v-if="siteConfig?.contact_github" :href="siteConfig.contact_github" target="_blank" rel="noopener" class="contact-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
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
