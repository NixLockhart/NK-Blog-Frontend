<template>
  <div class="message-board-page">
    <PageHeader title="留言板" subtitle="欢迎留下你的足迹~" />

    <MessageList />
    <FriendLinks />
  </div>
</template>

<script setup lang="ts">
import MessageList from '@/components/message/MessageList.vue'
import FriendLinks from '@/components/message/FriendLinks.vue'
import PageHeader from '@/components/common/PageHeader.vue'
</script>

<style scoped>
.message-board-page {
  max-width: 860px;
  margin: 0 auto;
  padding: var(--spacing-sm) var(--spacing-xl) var(--spacing-xl);
}

@media (max-width: 768px) {
  .message-board-page {
    padding: var(--spacing-base) var(--spacing-sm) var(--spacing-lg);
  }
}
</style>
