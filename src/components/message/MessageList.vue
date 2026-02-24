<template>
  <div class="message-list">
    <!-- 留言表单 -->
    <MessageForm @message-added="handleMessageAdded" />

    <!-- 留言区标题 -->
    <div class="messages-header">
      <h3 class="messages-section-title">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        全部留言
      </h3>
      <span v-if="totalCount > 0" class="messages-count">{{ totalCount }} 条</span>
    </div>

    <!-- 留言列表 -->
    <div v-if="loading && messages.length === 0" class="empty-state">
      <div class="loading-spinner-lg"></div>
    </div>
    <div v-else-if="messages.length === 0" class="empty-state">
      <svg class="empty-icon" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      <p>还没有留言，快来抢沙发吧!</p>
    </div>
    <div v-else class="messages-container" ref="messagesContainer" @scroll="handleScroll">
      <!-- 顶部加载提示 -->
      <div v-if="loadingMore" class="loading-more">
        <span class="loading-dot-spinner">
          <span></span><span></span><span></span>
        </span>
        <span>加载更早的留言...</span>
      </div>
      <div v-else-if="hasMore" class="load-more-hint">
        向上滚动加载更多
      </div>
      <div v-else class="load-more-hint">
        已经是最早的留言了
      </div>

      <div class="messages">
        <div v-for="message in messages" :key="message.id" class="message-item">
          <img
            :src="message.avatar ? getAvatarUrl(message.avatar) : defaultAvatar"
            :alt="message.nickname"
            class="message-avatar"
          />
          <div class="message-bubble">
            <div class="message-bubble-header">
              <span class="message-author">{{ message.nickname }}</span>
              <span class="message-time">{{ formatTime(message.createdAt) }}</span>
            </div>
            <div class="message-content markdown-body" v-html="renderUserContent(message.content)"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { messageApi } from '@/api/message'
import type { Message } from '@/types'
import { useMarkdown } from '@/composables/useMarkdown'
import { getAvatarUrl } from '@/utils/file'
import MessageForm from './MessageForm.vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const { renderUserContent } = useMarkdown()
const defaultAvatar = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"%3E%3Cpath fill="%23999" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/%3E%3C/svg%3E'

const messages = ref<Message[]>([])
const loading = ref(false)
const loadingMore = ref(false)
const messagesContainer = ref<HTMLElement>()
const currentPage = ref(1)
const pageSize = 10
const totalCount = ref(0)

const hasMore = computed(() => messages.value.length < totalCount.value)

const formatTime = (time: string) => {
  return dayjs(time).fromNow()
}

const loadMessages = async (append: boolean = false) => {
  if (append) {
    loadingMore.value = true
  } else {
    loading.value = true
  }

  try {
    const result = await messageApi.getList({
      page: currentPage.value - 1,
      size: pageSize
    })

    if (append) {
      // 加载更多时,将新数据添加到前面(因为是向上滚动加载更早的留言)
      const prevHeight = messagesContainer.value?.scrollHeight || 0
      messages.value = [...result.content, ...messages.value]
      // 保持滚动位置
      await nextTick()
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight - prevHeight
      }
    } else {
      messages.value = result.content
    }

    totalCount.value = result.total
  } catch (error) {
    console.error('加载留言失败:', error)
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

const handleScroll = async () => {
  if (!messagesContainer.value || loadingMore.value || !hasMore.value) return

  // 当滚动到顶部附近时加载更多
  if (messagesContainer.value.scrollTop < 50) {
    currentPage.value++
    await loadMessages(true)
  }
}

const handleMessageAdded = () => {
  // 有新留言时,重新加载第一页
  currentPage.value = 1
  loadMessages(false)
  // 滚动到底部
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

onMounted(() => {
  loadMessages()
  // 初始滚动到底部
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
})
</script>

<style scoped>
.message-list {
  max-width: 100%;
}

/* ==================== 留言区标题 ==================== */
.messages-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-base);
}

.messages-section-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
}

.messages-section-title svg {
  color: var(--color-primary);
}

.messages-count {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  background-color: var(--color-bg-secondary);
  padding: 2px 10px;
  border-radius: var(--radius-full);
}

/* ==================== 空状态 ==================== */
.empty-state {
  padding: var(--spacing-xl);
  text-align: center;
  color: var(--color-text-tertiary);
}

.empty-icon {
  display: block;
  margin: 0 auto var(--spacing-base);
  opacity: 0.4;
}

.empty-state p {
  margin: 0;
  font-size: var(--text-sm);
}

.loading-spinner-lg {
  width: 32px;
  height: 32px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto;
}

/* ==================== 留言容器 ==================== */
.messages-container {
  max-height: 620px;
  overflow-y: auto;
  padding: var(--spacing-base);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background-color: var(--color-bg-secondary);
}

/* 滚动条 */
.messages-container::-webkit-scrollbar {
  width: 6px;
}

.messages-container::-webkit-scrollbar-track {
  background: transparent;
}

.messages-container::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 3px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: var(--color-primary);
}

.messages-container {
  scrollbar-width: thin;
  scrollbar-color: var(--color-border) transparent;
}

/* ==================== 加载提示 ==================== */
.loading-more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-base);
  color: var(--color-text-tertiary);
  font-size: var(--text-xs);
  margin-bottom: var(--spacing-sm);
}

.loading-dot-spinner {
  display: inline-flex;
  gap: 4px;
}

.loading-dot-spinner span {
  display: block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: var(--color-primary);
  animation: dot-pulse 1.2s ease-in-out infinite;
}

.loading-dot-spinner span:nth-child(2) { animation-delay: 0.15s; }
.loading-dot-spinner span:nth-child(3) { animation-delay: 0.3s; }

@keyframes dot-pulse {
  0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
  40% { opacity: 1; transform: scale(1); }
}

.load-more-hint {
  text-align: center;
  padding: var(--spacing-xs) var(--spacing-base);
  color: var(--color-text-tertiary);
  font-size: var(--text-xs);
  margin-bottom: var(--spacing-sm);
}

/* ==================== 留言列表 ==================== */
.messages {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-base);
}

.message-item {
  display: flex;
  gap: var(--spacing-sm);
  align-items: flex-start;
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  margin-top: 2px;
  border: 1px solid var(--color-border);
}

/* ==================== 气泡 ==================== */
.message-bubble {
  flex: 1;
  min-width: 0;
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 2px var(--radius-lg) var(--radius-lg) var(--radius-lg);
  padding: var(--spacing-sm) var(--spacing-base);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.message-bubble:hover {
  border-color: var(--color-border-hover);
  box-shadow: var(--shadow-sm);
}

.message-bubble-header {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-sm);
  margin-bottom: 4px;
}

.message-author {
  font-weight: 600;
  color: var(--color-text);
  font-size: var(--text-sm);
}

.message-time {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  flex-shrink: 0;
}

.message-content {
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  line-height: 1.7;
  word-break: break-word;
}

.message-content :deep(p) {
  margin: 0;
}

.message-content :deep(p + p) {
  margin-top: var(--spacing-xs);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ==================== 移动端 ==================== */
@media (max-width: 768px) {
  .messages-container {
    max-height: 500px;
    padding: var(--spacing-sm);
    border-radius: var(--radius-md);
  }

  .message-avatar {
    width: 30px;
    height: 30px;
  }

  .message-bubble {
    padding: var(--spacing-xs) var(--spacing-sm);
  }

  .messages {
    gap: var(--spacing-sm);
  }
}
</style>
