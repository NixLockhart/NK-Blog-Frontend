<template>
  <div class="contact-section">
    <h3 class="section-title">联系方式</h3>
    <div v-if="loading" class="loading-state">
      <div class="loading"></div>
    </div>
    <div v-else-if="contactList.length === 0" class="empty-state">
      <p>暂无联系方式</p>
    </div>
    <div v-else class="contact-list">
      <div
        v-for="contact in contactList"
        :key="contact.key"
        class="contact-item"
        :title="contact.detail"
      >
        <div class="contact-icon" :style="{ background: contact.color }">
          <i :class="contact.icon"></i>
        </div>
        <span class="contact-name">{{ contact.name }}</span>
        <div class="contact-detail" v-if="contact.detail">
          {{ contact.detail }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { configApi } from '@/api/config'

interface ContactItem {
  key: string
  name: string
  detail: string
  icon: string
  color: string
}

const contactList = ref<ContactItem[]>([])
const loading = ref(false)

// 根据key生成图标和颜色的默认配置
const getDefaultIconAndColor = (key: string) => {
  const lowerKey = key.toLowerCase()

  // 根据关键词匹配图标
  if (lowerKey.includes('email') || lowerKey.includes('邮箱')) {
    return { icon: 'fas fa-envelope', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }
  } else if (lowerKey.includes('phone') || lowerKey.includes('电话')) {
    return { icon: 'fas fa-phone', color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }
  } else if (lowerKey.includes('wechat') || lowerKey.includes('weixin') || lowerKey.includes('微信')) {
    return { icon: 'fab fa-weixin', color: 'linear-gradient(135deg, #09bb07 0%, #1aad19 100%)' }
  } else if (lowerKey.includes('qq')) {
    return { icon: 'fab fa-qq', color: 'linear-gradient(135deg, #12B7F5 0%, #0E9FE5 100%)' }
  } else if (lowerKey.includes('gongzhonghao') || lowerKey.includes('公众号')) {
    return { icon: 'fas fa-comments', color: 'linear-gradient(135deg, #09bb07 0%, #1aad19 100%)' }
  } else if (lowerKey.includes('weibo') || lowerKey.includes('微博')) {
    return { icon: 'fab fa-weibo', color: 'linear-gradient(135deg, #FF8200 0%, #E63F00 100%)' }
  } else if (lowerKey.includes('github')) {
    return { icon: 'fab fa-github', color: 'linear-gradient(135deg, #24292e 0%, #40444b 100%)' }
  } else if (lowerKey.includes('telegram')) {
    return { icon: 'fab fa-telegram', color: 'linear-gradient(135deg, #0088cc 0%, #0077b5 100%)' }
  } else if (lowerKey.includes('twitter')) {
    return { icon: 'fab fa-twitter', color: 'linear-gradient(135deg, #1DA1F2 0%, #0077B5 100%)' }
  } else if (lowerKey.includes('address') || lowerKey.includes('地址')) {
    return { icon: 'fas fa-map-marker-alt', color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }
  }

  // 默认图标和颜色
  return { icon: 'fas fa-info-circle', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }
}

const loadContactConfig = async () => {
  loading.value = true
  try {
    const configs = await configApi.getContactConfig()

    // 将配置转换为联系方式列表
    contactList.value = Object.entries(configs)
      .filter(([key, item]: [string, any]) => {
        // 过滤出contact_开头且有config_value的记录
        return key.startsWith('contact_') && item.config_value
      })
      .map(([key, item]: [string, any]) => {
        const { icon, color } = getDefaultIconAndColor(key)
        return {
          key,
          name: item.description || key.replace('contact_', ''),  // 使用description作为显示名称
          detail: item.config_value,  // config_value作为详情
          icon,
          color
        }
      })
  } catch (error) {
    console.error('加载联系方式配置失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadContactConfig()
})
</script>

<style scoped>
.contact-section {
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  transition: var(--transition-base);
}

.contact-section:hover {
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

.loading-state,
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  color: var(--color-text-secondary);
}

.contact-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-sm);
}

.contact-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--color-bg);
  transition: all var(--transition-fast);
  cursor: pointer;
}

.contact-item:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-primary);
}

.contact-item:hover .contact-detail {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.contact-icon {
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

.contact-item:hover .contact-icon {
  transform: scale(1.1);
}

.contact-name {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text);
  text-align: center;
}

.contact-detail {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  margin-bottom: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-base);
  background-color: rgba(0, 0, 0, 0.9);
  color: #fff;
  font-size: var(--text-xs);
  border-radius: var(--radius-sm);
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all var(--transition-fast);
  pointer-events: none;
  z-index: 10;
  max-width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.contact-detail::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: rgba(0, 0, 0, 0.9);
}

@media (max-width: 768px) {
  .contact-list {
    grid-template-columns: repeat(3, 1fr);
  }

  .contact-icon {
    width: 40px;
    height: 40px;
    font-size: var(--text-lg);
  }

  .contact-name {
    font-size: var(--text-xs);
  }

  .contact-detail {
    max-width: 200px;
  }
}
</style>
