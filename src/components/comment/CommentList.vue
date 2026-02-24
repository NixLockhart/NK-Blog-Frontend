<template>
  <div class="comment-list">
    <h3 class="comment-title">评论 ({{ comments.length }})</h3>

    <!-- 主评论表单 -->
    <CommentForm
      :article-id="articleId"
      :key="`main-form`"
      @comment-added="handleCommentAdded"
    />

    <!-- 评论列表 -->
    <div v-if="loading" class="loading-state">
      <div class="loading"></div>
    </div>
    <div v-else-if="comments.length === 0" class="empty-state">
      <p>暂无评论,快来发表第一条评论吧!</p>
    </div>
    <div v-else class="comments">
      <div v-for="comment in comments" :key="comment.id" class="comment-wrapper">
        <CommentItem
          :comment="comment"
          :article-id="articleId"
          @reply="handleReply"
        />
        <!-- 回复表单 -->
        <div v-if="replyingTo === comment.id" class="reply-form-wrapper">
          <CommentForm
            :article-id="articleId"
            :parent-id="comment.id"
            :key="`reply-${comment.id}`"
            @comment-added="handleReplyAdded"
          />
          <button @click="cancelReply" class="cancel-reply-btn">取消回复</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { commentApi } from '@/api/comment'
import type { Comment } from '@/types'
import CommentForm from './CommentForm.vue'
import CommentItem from './CommentItem.vue'

const props = defineProps<{
  articleId: number
}>()

const comments = ref<Comment[]>([])
const loading = ref(false)
const replyingTo = ref<number | null>(null)

const loadComments = async () => {
  loading.value = true
  try {
    comments.value = await commentApi.getArticleComments(props.articleId)
  } catch (error) {
    console.error('加载评论失败:', error)
  } finally {
    loading.value = false
  }
}

const handleReply = (commentId: number) => {
  replyingTo.value = commentId
}

const cancelReply = () => {
  replyingTo.value = null
}

const handleCommentAdded = () => {
  loadComments()
}

const handleReplyAdded = () => {
  replyingTo.value = null
  loadComments()
}

onMounted(() => {
  loadComments()
})
</script>

<style scoped>
.comment-list {
  margin-top: var(--spacing-xl);
}

.comment-title {
  font-size: var(--text-2xl);
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  color: var(--color-text);
}

.loading-state,
.empty-state {
  padding: var(--spacing-xl);
  text-align: center;
  color: var(--color-text-secondary);
}

.comments {
  margin-top: var(--spacing-md);
}

.comment-wrapper {
  margin-bottom: var(--spacing-base);
}

.reply-form-wrapper {
  margin-left: var(--spacing-xl);
  margin-top: var(--spacing-base);
  padding: var(--spacing-base);
  background-color: var(--color-bg-tertiary);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--color-primary);
}

.cancel-reply-btn {
  margin-top: var(--spacing-sm);
  padding: var(--spacing-xs) var(--spacing-base);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-base);
  cursor: pointer;
  transition: var(--transition-fast);
}

.cancel-reply-btn:hover {
  background-color: var(--color-bg);
  border-color: var(--color-primary);
  color: var(--color-primary);
}
</style>
