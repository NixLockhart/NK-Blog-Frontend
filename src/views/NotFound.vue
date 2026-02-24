<template>
  <div class="not-found-page">
    <div class="not-found-content">
      <div class="error-code">404</div>
      <h1 class="error-title">页面未找到</h1>
      <p class="error-description">抱歉,您访问的页面不存在或已被删除。</p>
      <div class="error-actions">
        <router-link to="/" class="btn btn-primary">返回首页</router-link>
        <button class="btn btn-secondary" @click="goBack">返回上一页</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.not-found-page {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
}

.not-found-content {
  text-align: center;
  max-width: 600px;
}

.error-code {
  font-size: 120px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: var(--spacing-base);
}

.error-title {
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 var(--spacing-base) 0;
}

.error-description {
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  margin: 0 0 var(--spacing-xl) 0;
}

.error-actions {
  display: flex;
  gap: var(--spacing-base);
  justify-content: center;
  flex-wrap: wrap;
}

.btn-secondary {
  background-color: var(--color-bg-secondary);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover {
  background-color: var(--color-border);
}

@media (max-width: 768px) {
  .error-code {
    font-size: 80px;
  }

  .error-title {
    font-size: var(--text-2xl);
  }

  .error-description {
    font-size: var(--text-base);
  }

  .error-actions {
    flex-direction: column;
  }
}
</style>
