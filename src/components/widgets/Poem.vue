<template>
  <div class="poem-widget">
    <div v-if="loading && !poem" class="loading-state">
      <div class="loading"></div>
      <p>加载中...</p>
    </div>
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button class="btn btn-sm" @click="loadPoem">重新加载</button>
    </div>
    <div v-else-if="poem" class="poem-content" :class="{ 'is-updating': loading }">
      <div class="poem-sentences">
        <div v-for="(line, index) in poemLines" :key="index" class="poem-line">
          {{ line }}
        </div>
      </div>
      <div class="poem-info">
        【{{ poem.dynasty }}】{{ poem.author }}《{{ poem.title }}》
      </div>
      <button class="refresh-btn" @click="loadPoem" :disabled="loading" title="换一首">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="23 4 23 10 17 10"></polyline>
          <polyline points="1 20 1 14 7 14"></polyline>
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface PoemData {
  content: string
  title: string
  author: string
  dynasty: string
}

const poem = ref<PoemData | null>(null)
const loading = ref(false)
const error = ref<string>('')

// 处理诗句：分行并去除标点符号
const poemLines = computed(() => {
  if (!poem.value || !poem.value.content) return []

  // 按标点符号分割诗句
  const lines = poem.value.content
    .split(/[，。！？；、,.!?;]/)
    .map(line => line.trim())
    .filter(line => line.length > 0)

  return lines
})

// 动态加载今日诗词SDK
const loadJinrishiciSDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // 检查是否已加载
    if (window.jinrishici) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://sdk.jinrishici.com/v2/browser/jinrishici.js'
    script.charset = 'utf-8'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('SDK加载失败'))
    document.head.appendChild(script)
  })
}

const loadPoem = async () => {
  // 先显示默认诗词，避免长时间等待
  if (!poem.value) {
    poem.value = {
      content: '床前明月光，疑是地上霜。举头望明月，低头思故乡。',
      title: '静夜思',
      author: '李白',
      dynasty: '唐'
    }
  }

  loading.value = true
  error.value = ''

  try {
    // 加载 SDK（如果已加载则立即返回）
    await loadJinrishiciSDK()

    // 使用 SDK 加载诗词
    if (window.jinrishici) {
      window.jinrishici.load((result: any) => {
        try {
          if (result && result.data) {
            poem.value = {
              content: result.data.content,
              title: result.data.origin.title,
              author: result.data.origin.author,
              dynasty: result.data.origin.dynasty
            }
          }
        } catch (e) {
          console.error('诗词解析失败:', e)
        } finally {
          loading.value = false
        }
      }, (err: any) => {
        console.error('诗词加载失败:', err)
        loading.value = false
      })
    } else {
      loading.value = false
    }
  } catch (err) {
    console.error('SDK加载失败:', err)
    loading.value = false
  }
}

onMounted(() => {
  loadPoem()
})

// 声明全局类型
declare global {
  interface Window {
    jinrishici?: {
      load: (success: (result: any) => void, error?: (err: any) => void) => void
    }
  }
}
</script>

<style scoped>
.poem-widget {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  color: #fff;
  position: relative;
  min-height: 200px;
  box-shadow: var(--shadow-lg);
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: #fff;
}

.loading-state p,
.error-state p {
  margin-top: var(--spacing-base);
  font-size: var(--text-sm);
}

.error-state button {
  margin-top: var(--spacing-base);
  background-color: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  padding: var(--spacing-xs) var(--spacing-base);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: var(--transition-fast);
}

.error-state button:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.poem-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 180px;
  padding: var(--spacing-md);
  transition: opacity var(--transition-base);
}

.poem-content.is-updating {
  opacity: 0.6;
}

.poem-sentences {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-md);
}

.poem-line {
  font-size: var(--text-xl);
  font-weight: 500;
  line-height: 1.8;
  text-align: center;
  font-family: 'STKaiti', 'KaiTi', serif;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  letter-spacing: 2px;
}

.poem-info {
  font-size: var(--text-sm);
  opacity: 0.9;
  text-align: center;
  font-style: italic;
}

.refresh-btn {
  position: absolute;
  top: var(--spacing-base);
  right: var(--spacing-base);
  padding: var(--spacing-xs);
  background-color: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: var(--radius-sm);
  color: #fff;
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
}

.refresh-btn:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: rotate(180deg);
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 响应式 */
@media (max-width: 768px) {
  .poem-widget {
    padding: var(--spacing-base);
  }

  .poem-line {
    font-size: var(--text-lg);
  }

  .poem-info {
    font-size: var(--text-xs);
  }
}
</style>
