<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '@/stores/app'
import AIChat from './AIChat.vue'

const appStore = useAppStore()

// 是否显示聊天窗口
const showChat = ref(false)
// 是否为移动端
const isMobile = ref(false)

// 检查AI助手是否启用
const isEnabled = computed(() => {
  const config = appStore.siteConfig
  if (!config) return false
  // 从配置中获取ai_assistant字段
  const aiEnabled = (config as any).ai_assistant
  return aiEnabled === 'true' || aiEnabled === true
})

// 检测是否为移动端
function checkMobile() {
  isMobile.value = window.innerWidth <= 768
}

// 打开聊天
function openChat() {
  showChat.value = true
  if (isMobile.value) {
    document.body.style.overflow = 'hidden'
  }
}

// 关闭聊天
function closeChat() {
  showChat.value = false
  document.body.style.overflow = ''
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  document.body.style.overflow = ''
})
</script>

<template>
  <div v-if="isEnabled" class="ai-assistant">
    <!-- 悬浮按钮 -->
    <transition name="fade">
      <button
        v-show="!showChat || isMobile"
        class="ai-fab"
        @click="openChat"
        title="AI 助手"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
          <circle cx="7.5" cy="14.5" r="1.5"/>
          <circle cx="16.5" cy="14.5" r="1.5"/>
        </svg>
      </button>
    </transition>

    <!-- 桌面端弹出窗口 -->
    <transition name="popup">
      <div v-if="showChat && !isMobile" class="ai-popup">
        <AIChat @close="closeChat" />
      </div>
    </transition>

    <!-- 移动端全屏页面 -->
    <transition name="slide-up">
      <div v-if="showChat && isMobile" class="ai-fullscreen">
        <AIChat @close="closeChat" />
      </div>
    </transition>

    <!-- 移动端遮罩 -->
    <transition name="fade">
      <div v-if="showChat && isMobile" class="ai-overlay" @click="closeChat"></div>
    </transition>
  </div>
</template>

<style scoped>
.ai-assistant {
  position: fixed;
  z-index: 1000;
}

/* 悬浮按钮 - 位于目录按钮上方（目录按钮在回到顶部按钮上方） */
.ai-fab {
  position: fixed;
  right: var(--spacing-lg);
  bottom: calc(var(--spacing-lg) + 48px + var(--spacing-sm) + 48px + var(--spacing-sm));
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  color: #fff;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: var(--shadow-lg);
  transition: var(--transition-base);
  z-index: 1000;
}

.ai-fab:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.ai-fab:active {
  transform: translateY(-2px);
}

/* 桌面端弹出窗口 */
.ai-popup {
  position: fixed;
  right: var(--spacing-lg);
  bottom: calc(var(--spacing-lg) + 48px + var(--spacing-sm) + 48px + var(--spacing-sm));
  width: 400px;
  height: 520px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  overflow: hidden;
  z-index: 1001;
}

/* 移动端全屏 */
.ai-fullscreen {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 85vh;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1002;
}

.ai-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1001;
}

/* 动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.popup-enter-active,
.popup-leave-active {
  transition: all 0.25s ease;
}

.popup-enter-from,
.popup-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}

/* 响应式 */
@media (max-width: 768px) {
  .ai-fab {
    right: var(--spacing-base);
    /* 在目录按钮上方：回到顶部(40px) + 间距 + 目录按钮(40px) + 间距 */
    bottom: calc(var(--spacing-base) + 40px + var(--spacing-sm) + 40px + var(--spacing-sm));
    width: 40px;
    height: 40px;
  }

  .ai-fab svg {
    width: 20px;
    height: 20px;
  }
}
</style>
