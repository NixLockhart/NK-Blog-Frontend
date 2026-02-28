<template>
  <div class="comment-item">
    <div class="comment-header">
      <img :src="getAvatarUrl(comment.avatar, defaultAvatar)" :alt="comment.nickname" class="comment-avatar" width="40" height="40" />
      <div class="comment-info">
        <span class="comment-author">{{ comment.nickname }}</span>
        <span class="comment-time">{{ formatTime(comment.createdAt) }}</span>
      </div>
    </div>
    <div class="comment-content markdown-body" v-html="renderedContent"></div>
    <div class="comment-actions">
      <button class="action-btn" @click="handleReply">回复</button>
    </div>

    <!-- 子评论 -->
    <div v-if="comment.children && comment.children.length > 0" class="comment-children">
      <CommentItem
        v-for="child in comment.children"
        :key="child.id"
        :comment="child"
        :article-id="articleId"
        @reply="$emit('reply', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Comment } from '@/types'
import { useMarkdown } from '@/composables/useMarkdown'
import { getAvatarUrl } from '@/utils/file'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const props = defineProps<{
  comment: Comment
  articleId: number
}>()

const emit = defineEmits<{
  reply: [commentId: number]
}>()

const { renderUserContent } = useMarkdown()
const defaultAvatar = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"%3E%3Cpath fill="%23999" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/%3E%3C/svg%3E'

const renderedContent = computed(() => renderUserContent(props.comment.content))

const formatTime = (time: string) => {
  return dayjs(time).fromNow()
}

const handleReply = () => {
  emit('reply', props.comment.id)
}
</script>

<style scoped>
.comment-item {
  padding: var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-base);
  background-color: var(--color-bg);
}

.comment-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}

.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.comment-info {
  display: flex;
  flex-direction: column;
}

.comment-author {
  font-weight: 600;
  color: var(--color-text);
  font-size: var(--text-sm);
}

.comment-time {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
}

.comment-content {
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  line-height: 1.6;
}

.comment-actions {
  display: flex;
  gap: var(--spacing-base);
}

.action-btn {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  background-color: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: var(--transition-fast);
}

.action-btn:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.comment-children {
  margin-top: var(--spacing-base);
  margin-left: var(--spacing-xl);
  padding-left: var(--spacing-base);
  border-left: 2px solid var(--color-border);
}
</style>
