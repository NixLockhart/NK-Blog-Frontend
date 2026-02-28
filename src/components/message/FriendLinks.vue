<template>
  <div class="friend-links" v-if="friendLinks.length > 0">
    <div class="friend-links-header">
      <h3 class="friend-links-title">
        <Icon name="link" :size="18" />
        友情链接
      </h3>
      <span class="friend-links-count">{{ friendLinks.length }} 位友邻</span>
    </div>
    <div class="friend-links-grid">
      <a
        v-for="friend in friendLinks"
        :key="friend.id"
        :href="friend.blogUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="friend-link-card"
      >
        <div class="friend-avatar">
          <img
            v-if="friend.avatar"
            :src="getAvatarUrl(friend.avatar)"
            :alt="friend.nickname"
            width="40"
            height="40"
          />
          <div v-else class="avatar-letter">{{ friend.nickname.charAt(0) }}</div>
        </div>
        <div class="friend-info">
          <div class="friend-nickname">{{ friend.nickname }}</div>
          <div class="friend-website">
            <Icon name="external-link" :size="12" />
            {{ formatWebsite(friend.blogUrl) }}
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { messageApi } from '@/api/message'
import { getAvatarUrl } from '@/utils/file'
import type { Message } from '@/types'
import Icon from '@/components/common/Icon.vue'

const friendLinks = ref<Message[]>([])
const loading = ref(false)

const loadFriendLinks = async () => {
  loading.value = true
  try {
    friendLinks.value = await messageApi.getFriendLinks()
  } catch (error) {
    console.error('加载友情链接失败:', error)
  } finally {
    loading.value = false
  }
}

const formatWebsite = (blogUrl?: string) => {
  if (!blogUrl) return ''
  try {
    const url = new URL(blogUrl)
    return url.hostname
  } catch {
    return blogUrl
  }
}

onMounted(() => {
  loadFriendLinks()
})
</script>

<style scoped>
.friend-links {
  margin-top: var(--spacing-xl);
}

.friend-links-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-base);
}

.friend-links-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
}

.friend-links-title svg {
  color: var(--color-primary);
}

.friend-links-count {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  background-color: var(--color-bg-secondary);
  padding: 2px 10px;
  border-radius: var(--radius-full);
}

.friend-links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--spacing-sm);
}

.friend-link-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-base);
  background-color: var(--color-bg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  text-decoration: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.friend-link-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-primary);
}

.friend-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid var(--color-border);
}

.friend-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-letter {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: #fff;
  font-size: var(--text-base);
  font-weight: 600;
}

.friend-info {
  flex: 1;
  min-width: 0;
}

.friend-nickname {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.4;
}

.friend-website {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.4;
}

.friend-website svg {
  flex-shrink: 0;
  opacity: 0.6;
}

@media (max-width: 768px) {
  .friend-links {
    margin-top: var(--spacing-lg);
  }

  .friend-links-grid {
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-sm);
  }

  .friend-link-card {
    padding: var(--spacing-sm);
  }

  .friend-avatar {
    width: 32px;
    height: 32px;
  }

  .friend-nickname {
    font-size: var(--text-xs);
  }

  .friend-website {
    font-size: 10px;
  }
}

@media (max-width: 380px) {
  .friend-links-grid {
    grid-template-columns: 1fr;
  }
}
</style>
