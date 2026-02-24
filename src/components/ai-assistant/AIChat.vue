<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import { sendMessage } from '@/api/ai'
import AIMessage from './AIMessage.vue'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const emit = defineEmits<{
  close: []
}>()

const messages = ref<Message[]>([])
const inputText = ref('')
const isLoading = ref(false)
const conversationId = ref<string>()
const messagesContainer = ref<HTMLElement>()
const textareaRef = ref<HTMLTextAreaElement>()

async function scrollToBottom() {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

function autoResize() {
  const textarea = textareaRef.value
  if (textarea) {
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
  }
}

watch(inputText, autoResize)

async function handleSend() {
  const query = inputText.value.trim()
  if (!query || isLoading.value) return

  inputText.value = ''
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
  }

  messages.value.push({ role: 'user', content: query })
  await scrollToBottom()

  isLoading.value = true
  messages.value.push({ role: 'assistant', content: '' })
  const msgIndex = messages.value.length - 1

  try {
    for await (const event of sendMessage(query, conversationId.value)) {
      if (event.conversation_id) {
        conversationId.value = event.conversation_id
      }

      if (event.event === 'agent_message' || event.event === 'message') {
        const currentMsg = messages.value[msgIndex]
        if (currentMsg) {
          currentMsg.content += event.answer || ''
        }
        await scrollToBottom()
      }
    }
  } catch (e) {
    const currentMsg = messages.value[msgIndex]
    if (currentMsg) {
      currentMsg.content = `错误: ${e}`
    }
  } finally {
    isLoading.value = false
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}

function newChat() {
  messages.value = []
  conversationId.value = undefined
}
</script>

<template>
  <div class="ai-chat">
    <header class="ai-chat-header">
      <div class="header-left">
        <div class="ai-avatar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
            <circle cx="7.5" cy="14.5" r="1.5"/>
            <circle cx="16.5" cy="14.5" r="1.5"/>
          </svg>
        </div>
        <h3>AI 助手</h3>
      </div>
      <div class="header-actions">
        <button class="action-btn" @click="newChat" title="新对话">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
        <button class="action-btn close-btn" @click="emit('close')" title="关闭">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </header>

    <main ref="messagesContainer" class="ai-chat-messages">
      <div v-if="messages.length === 0" class="empty-state">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <p>有什么可以帮助你的？</p>
      </div>
      <AIMessage
        v-for="(msg, idx) in messages"
        :key="idx"
        :role="msg.role"
        :content="msg.content"
      />
      <div v-if="isLoading" class="loading-indicator">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    </main>

    <footer class="ai-chat-input">
      <textarea
        ref="textareaRef"
        v-model="inputText"
        placeholder="输入消息..."
        @keydown="handleKeydown"
        :disabled="isLoading"
        rows="1"
      ></textarea>
      <button class="send-btn" @click="handleSend" :disabled="isLoading || !inputText.trim()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="22" y1="2" x2="11" y2="13"/>
          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
      </button>
    </footer>
  </div>
</template>

<style scoped>
.ai-chat {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--color-bg);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

/* 头部 */
.ai-chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg-secondary);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ai-avatar {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  border-radius: var(--radius-sm);
  color: white;
}

.ai-chat-header h3 {
  font-size: 15px;
  font-weight: 600;
  margin: 0;
  color: var(--color-text);
}

.header-actions {
  display: flex;
  gap: 4px;
}

.action-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.15s ease;
}

.action-btn:hover {
  background: var(--color-bg-tertiary, rgba(0,0,0,0.05));
  color: var(--color-text);
}

.close-btn:hover {
  color: var(--color-accent, #e74c3c);
}

/* 消息区域 */
.ai-chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  scroll-behavior: smooth;
}

.ai-chat-messages::-webkit-scrollbar {
  width: 6px;
}

.ai-chat-messages::-webkit-scrollbar-track {
  background: transparent;
}

.ai-chat-messages::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 3px;
}

.empty-state {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--color-text-tertiary);
  gap: 10px;
}

.empty-state p {
  font-size: 14px;
}

/* 加载动画 */
.loading-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 0;
}

.loading-indicator .dot {
  width: 6px;
  height: 6px;
  background: var(--color-text-tertiary);
  border-radius: 50%;
  animation: bounce 1.4s ease-in-out infinite both;
}

.loading-indicator .dot:nth-child(1) { animation-delay: -0.32s; }
.loading-indicator .dot:nth-child(2) { animation-delay: -0.16s; }
.loading-indicator .dot:nth-child(3) { animation-delay: 0s; }

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0.6);
    opacity: 0.4;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 输入区域 */
.ai-chat-input {
  display: flex;
  gap: 10px;
  padding: 12px 16px;
  background: var(--color-bg-secondary);
  border-top: 1px solid var(--color-border);
}

.ai-chat-input textarea {
  flex: 1;
  min-height: 40px;
  max-height: 120px;
  padding: 10px 12px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-size: 14px;
  font-family: inherit;
  resize: none;
  outline: none;
  line-height: 1.5;
  transition: border-color 0.15s ease;
}

.ai-chat-input textarea::placeholder {
  color: var(--color-text-tertiary);
}

.ai-chat-input textarea:focus {
  border-color: var(--color-primary);
}

.ai-chat-input textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.send-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary);
  border: none;
  border-radius: var(--radius-md);
  color: #fff;
  cursor: pointer;
  transition: all 0.15s ease;
  flex-shrink: 0;
}

.send-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
