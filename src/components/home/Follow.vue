<template>
  <div class="follow-section">
    <h3 class="section-title">关注我</h3>
    <div v-if="loading" class="loading-state">
      <div class="loading"></div>
    </div>
    <div v-else-if="followLinks.length === 0" class="empty-state">
      <p>暂无关注链接</p>
    </div>
    <div v-else class="follow-list">
      <a
        v-for="item in followLinks"
        :key="item.key"
        :href="item.url"
        target="_blank"
        rel="noopener noreferrer"
        class="follow-item"
      >
        <div class="follow-icon" :style="{ background: item.color }">
          <i :class="item.icon"></i>
        </div>
        <span class="follow-name">{{ item.name }}</span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { configApi } from '@/api/config'

interface FollowLink {
  key: string
  name: string
  url: string
  icon: string
  color: string
}

const followLinks = ref<FollowLink[]>([])
const loading = ref(false)

// 根据key生成图标和颜色的默认配置
const getDefaultIconAndColor = (key: string) => {
  const lowerKey = key.toLowerCase()

  // 根据关键词匹配图标
  if (lowerKey.includes('github')) {
    return { icon: 'fab fa-github', color: 'linear-gradient(135deg, #24292e 0%, #40444b 100%)' }
  } else if (lowerKey.includes('gitee')) {
    return { icon: 'fas fa-code-branch', color: 'linear-gradient(135deg, #C71D23 0%, #E53935 100%)' }
  } else if (lowerKey.includes('csdn') || lowerKey.includes('blog')) {
    return { icon: 'fas fa-blog', color: 'linear-gradient(135deg, #FC5C7D 0%, #6A82FB 100%)' }
  } else if (lowerKey.includes('bilibili') || lowerKey.includes('哔哩')) {
    return { icon: 'fas fa-video', color: 'linear-gradient(135deg, #00A1D6 0%, #00D4FF 100%)' }
  } else if (lowerKey.includes('music') || lowerKey.includes('网易云') || lowerKey.includes('音乐')) {
    return { icon: 'fas fa-music', color: 'linear-gradient(135deg, #D43F3A 0%, #EF4E7B 100%)' }
  } else if (lowerKey.includes('zhihu') || lowerKey.includes('知乎')) {
    return { icon: 'fab fa-zhihu', color: 'linear-gradient(135deg, #0084FF 0%, #0066FF 100%)' }
  } else if (lowerKey.includes('weibo') || lowerKey.includes('微博')) {
    return { icon: 'fab fa-weibo', color: 'linear-gradient(135deg, #FF8200 0%, #E63F00 100%)' }
  } else if (lowerKey.includes('twitter')) {
    return { icon: 'fab fa-twitter', color: 'linear-gradient(135deg, #1DA1F2 0%, #0077B5 100%)' }
  } else if (lowerKey.includes('youtube') || lowerKey.includes('油管')) {
    return { icon: 'fab fa-youtube', color: 'linear-gradient(135deg, #FF0000 0%, #CC0000 100%)' }
  } else if (lowerKey.includes('linkedin')) {
    return { icon: 'fab fa-linkedin', color: 'linear-gradient(135deg, #0077B5 0%, #00669C 100%)' }
  } else if (lowerKey.includes('facebook')) {
    return { icon: 'fab fa-facebook', color: 'linear-gradient(135deg, #3B5998 0%, #2D4373 100%)' }
  } else if (lowerKey.includes('instagram')) {
    return { icon: 'fab fa-instagram', color: 'linear-gradient(135deg, #E1306C 0%, #C13584 100%)' }
  } else if (lowerKey.includes('juejin') || lowerKey.includes('掘金')) {
    return { icon: 'fas fa-gem', color: 'linear-gradient(135deg, #1E80FF 0%, #00D4FF 100%)' }
  } else if (lowerKey.includes('stackoverflow')) {
    return { icon: 'fab fa-stack-overflow', color: 'linear-gradient(135deg, #F48024 0%, #E36D25 100%)' }
  }

  // 默认图标和颜色
  return { icon: 'fas fa-link', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }
}

const loadFollowLinks = async () => {
  loading.value = true
  try {
    const configs = await configApi.getLinkConfig()

    // 将配置转换为关注链接列表
    followLinks.value = Object.entries(configs)
      .filter(([key, item]: [string, any]) => {
        // 过滤出link_开头且有config_value的记录
        return key.startsWith('link_') && item.config_value
      })
      .map(([key, item]: [string, any]) => {
        const { icon, color } = getDefaultIconAndColor(key)
        return {
          key,
          name: item.description || key.replace('link_', ''),  // 使用description作为显示名称
          url: item.config_value,  // config_value作为链接
          icon,
          color
        }
      })
  } catch (error) {
    console.error('加载关注链接失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadFollowLinks()
})
</script>

<style scoped>
.follow-section {
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  transition: var(--transition-base);
}

.follow-section:hover {
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

.follow-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-sm);
}

.follow-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--color-bg);
  text-decoration: none;
  transition: all var(--transition-fast);
  cursor: pointer;
}

.follow-item:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-primary);
}

.follow-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: var(--text-xl);
  transition: var(--transition-fast);
}

.follow-item:hover .follow-icon {
  transform: scale(1.1);
}

.follow-name {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text);
  text-align: center;
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-xl);
}

.loading {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-state {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-text-secondary);
}

.empty-state p {
  margin: 0;
  font-size: var(--text-sm);
}

@media (max-width: 768px) {
  .follow-list {
    grid-template-columns: repeat(3, 1fr);
  }

  .follow-icon {
    width: 40px;
    height: 40px;
    font-size: var(--text-lg);
  }

  .follow-name {
    font-size: var(--text-xs);
  }
}
</style>
