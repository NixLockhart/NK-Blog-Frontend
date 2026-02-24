<template>
  <div class="message-board-page">
    <div class="page-header">
      <h1 class="page-title">留言板</h1>
      <span class="page-header-decoration"></span>
      <p class="page-subtitle">欢迎留下你的足迹~</p>
    </div>

    <MessageList />
    <FriendLinks />
  </div>
</template>

<script setup lang="ts">
import MessageList from '@/components/message/MessageList.vue'
import FriendLinks from '@/components/message/FriendLinks.vue'
</script>

<style scoped>
.message-board-page {
  max-width: 860px;
  margin: 0 auto;
  padding: var(--spacing-sm) var(--spacing-xl) var(--spacing-xl);
}

.page-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
  padding-bottom: var(--spacing-lg);
}

.page-title {
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 var(--spacing-sm) 0;
  letter-spacing: 0.02em;
}

.page-header-decoration {
  display: block;
  width: 40px;
  height: 3px;
  margin: 0 auto var(--spacing-sm);
  border-radius: var(--radius-full);
  background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
}

.page-subtitle {
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
  margin: 0;
  letter-spacing: 0.04em;
}

@media (max-width: 768px) {
  .message-board-page {
    padding: var(--spacing-base) var(--spacing-sm) var(--spacing-lg);
  }

  .page-header {
    margin-bottom: var(--spacing-lg);
    padding-bottom: var(--spacing-base);
  }

  .page-title {
    font-size: var(--text-2xl);
  }
}
</style>
