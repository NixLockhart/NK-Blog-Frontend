<template>
  <div class="opensource-section">
    <h3 class="section-title">开源项目</h3>
    <div class="project-list">
      <a
        v-for="project in projects"
        :key="project.name"
        :href="project.url"
        target="_blank"
        rel="noopener noreferrer"
        class="project-card"
      >
        <div class="project-icon" :style="{ background: project.color }">
          <i :class="project.icon"></i>
        </div>
        <div class="project-info">
          <h4 class="project-name">{{ project.name }}</h4>
          <p class="project-desc">{{ project.description }}</p>
          <div class="project-meta">
            <span class="meta-item">
              <i class="fas fa-star"></i>
              {{ project.stars }}
            </span>
            <span class="meta-item">
              <i class="fas fa-code-branch"></i>
              {{ project.language }}
            </span>
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Project {
  name: string
  description: string
  url: string
  icon: string
  color: string
  stars: string
  language: string
}

const projects = ref<Project[]>([
  {
    name: 'NixStudio',
    description: '个人博客系统 - Vue3 + Spring Boot 全栈项目',
    url: 'https://github.com/NixLockhart/NixStudio',
    icon: 'fas fa-blog',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    stars: 'New',
    language: 'Vue3'
  },
  {
    name: 'StarBlog',
    description: '星光小栈 - 经典JSP博客系统',
    url: 'https://github.com/NixLockhart/StarBlog',
    icon: 'fas fa-star',
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    stars: 'Legacy',
    language: 'JSP'
  }
])
</script>

<style scoped>
.opensource-section {
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  transition: var(--transition-base);
}

.opensource-section:hover {
  box-shadow: var(--shadow-md);
}

.section-title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--color-primary);
}

.project-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.project-card {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--color-bg);
  text-decoration: none;
  transition: all var(--transition-fast);
  cursor: pointer;
}

.project-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-primary);
}

.project-icon {
  width: 56px;
  height: 56px;
  min-width: 56px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: var(--text-2xl);
  transition: var(--transition-fast);
}

.project-card:hover .project-icon {
  transform: scale(1.05);
}

.project-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.project-name {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
}

.project-desc {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin: 0;
  line-height: 1.5;
}

.project-meta {
  display: flex;
  gap: var(--spacing-md);
  margin-top: auto;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
}

.meta-item i {
  color: var(--color-primary);
}

@media (max-width: 768px) {
  .project-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .project-icon {
    width: 48px;
    height: 48px;
    min-width: 48px;
    font-size: var(--text-xl);
  }

  .project-meta {
    justify-content: center;
  }
}
</style>
