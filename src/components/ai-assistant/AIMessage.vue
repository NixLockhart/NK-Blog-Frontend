<script setup lang="ts">
import { computed, ref } from 'vue'
import { renderMarkdown, parseThinking } from './markdown'

const props = defineProps<{
  role: 'user' | 'assistant'
  content: string
}>()

const isThinkingCollapsed = ref(false)
const parsed = computed(() => parseThinking(props.content))
const renderedAnswer = computed(() => renderMarkdown(parsed.value.answer))
const renderedThinking = computed(() =>
  parsed.value.thinking ? renderMarkdown(parsed.value.thinking) : ''
)

function toggleThinking() {
  isThinkingCollapsed.value = !isThinkingCollapsed.value
}
</script>

<template>
  <div class="ai-message" :class="role">
    <div class="ai-message-header">
      <span class="role-label">{{ role === 'user' ? '你' : 'AI' }}</span>
    </div>

    <!-- Thinking 区块 -->
    <div v-if="renderedThinking" class="thinking-block">
      <div
        class="thinking-header"
        :class="{ collapsed: isThinkingCollapsed }"
        @click="toggleThinking"
      >
        <svg class="thinking-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 16v-4M12 8h.01"/>
        </svg>
        <span>思考过程</span>
        <svg class="toggle-icon" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
      <div v-show="!isThinkingCollapsed" class="thinking-content markdown-body" v-html="renderedThinking"></div>
    </div>

    <!-- 主要回复内容 -->
    <div class="ai-message-content markdown-body" v-html="renderedAnswer"></div>
  </div>
</template>

<style scoped>
.ai-message {
  margin-bottom: 16px;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.ai-message-header {
  margin-bottom: 6px;
}

.role-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-tertiary);
}

/* Thinking 区块 */
.thinking-block {
  margin-bottom: 10px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg-secondary);
  overflow: hidden;
}

.thinking-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  cursor: pointer;
  user-select: none;
  transition: background 0.15s ease;
}

.thinking-header:hover {
  background: var(--color-bg-tertiary, rgba(0,0,0,0.05));
}

.thinking-icon {
  opacity: 0.7;
}

.thinking-header span {
  font-size: 12px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.toggle-icon {
  margin-left: auto;
  color: var(--color-text-tertiary);
  transition: transform 0.2s ease;
}

.thinking-header.collapsed .toggle-icon {
  transform: rotate(-90deg);
}

.thinking-content {
  padding: 10px 12px;
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  max-height: 200px;
  overflow-y: auto;
  border-top: 1px solid var(--color-border);
}

/* 消息内容 */
.ai-message-content {
  line-height: 1.7;
  font-size: 14px;
}
</style>
