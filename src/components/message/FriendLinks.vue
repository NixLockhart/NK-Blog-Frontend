<template>
  <div class="friend-links" v-if="friendLinks.length > 0">
    <div class="friend-links-header">
      <h3 class="friend-links-title">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
        </svg>
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
          />
          <div v-else class="avatar-letter">{{ friend.nickname.charAt(0) }}</div>
        </div>
        <div class="friend-info">
          <div class="friend-nickname">{{ friend.nickname }}</div>
          <div class="friend-website">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
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
