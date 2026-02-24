<template>
  <div class="dynamic-widget">
    <div v-if="loading" class="loading-state">
      <div class="loading"></div>
    </div>
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <p class="error-detail">{{ widget.name }} - {{ widget.codePath }}</p>
    </div>
    <iframe
      v-else
      ref="widgetFrame"
      class="widget-frame"
      :srcdoc="widgetHtml"
      sandbox="allow-scripts allow-same-origin"
      scrolling="no"
      :style="{ height: frameHeight + 'px' }"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { widgetApi } from '@/api/widget'
import type { Widget } from '@/api/widget'
import { API_BASE_URL } from '@/config/env'

interface Props {
  widget: Widget
}

const props = defineProps<Props>()

const widgetFrame = ref<HTMLIFrameElement | null>(null)
const widgetHtml = ref('')
const loading = ref(true)
const error = ref<string>('')
const frameHeight = ref(150)

const handleMessage = (event: MessageEvent) => {
  if (
    event.data &&
    event.data.type === 'widget-resize' &&
    typeof event.data.height === 'number' &&
    event.data.height > 0 &&
    widgetFrame.value &&
    event.source === widgetFrame.value.contentWindow
  ) {
    frameHeight.value = event.data.height
  }
}

const loadWidget = async () => {
  loading.value = true
  error.value = ''

  try {
    let html = await widgetApi.getWidgetHtml(props.widget.codePath)

    // 注入样式重置：消除 body 默认 margin，隐藏滚动条，解除小工具 max-width 限制
    const resetStyle = `<style>html,body{margin:0;padding:0;overflow:hidden;}.widget-container{max-width:100%!important;box-sizing:border-box!important;}</style>`

    // 注入 API 配置脚本
    const apiConfigScript = `<script>window.__BLOG_API_BASE_URL__='${API_BASE_URL}';<\/script>`

    // 在 <head> 或文档开头注入样式重置和 API 配置
    if (html.includes('<head>')) {
      html = html.replace('<head>', '<head>' + resetStyle + apiConfigScript)
    } else if (html.includes('<script')) {
      html = resetStyle + apiConfigScript + html
    } else {
      html = resetStyle + apiConfigScript + html
    }

    // 注入高度同步脚本到 </body> 或末尾
    // 使用 ResizeObserver + MutationObserver + 定时轮询三重保障
    const resizeScript = `<script>
(function(){
  function getHeight(){
    return Math.max(
      document.body.scrollHeight||0,
      document.body.offsetHeight||0,
      document.documentElement.scrollHeight||0,
      document.documentElement.offsetHeight||0
    );
  }
  function send(){
    var h=getHeight();
    if(h>0) parent.postMessage({type:'widget-resize',height:h},'*');
  }
  new ResizeObserver(send).observe(document.body);
  new MutationObserver(send).observe(document.body,{childList:true,subtree:true,attributes:true});
  send();
  var count=0;
  var timer=setInterval(function(){
    send();
    if(++count>=20) clearInterval(timer);
  },500);
})();
<\/script>`

    if (html.includes('</body>')) {
      html = html.replace('</body>', resizeScript + '</body>')
    } else {
      html += resizeScript
    }

    widgetHtml.value = html
    loading.value = false
  } catch (err: any) {
    console.error(`加载小工具失败 (${props.widget.name}):`, err)
    error.value = `加载失败: ${err.message || '未知错误'}`
    loading.value = false
  }
}

onMounted(() => {
  window.addEventListener('message', handleMessage)
  loadWidget()
})

onUnmounted(() => {
  window.removeEventListener('message', handleMessage)
})
</script>

<style scoped>
.dynamic-widget {
  width: 100%;
  margin-bottom: 20px;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100px;
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  color: var(--color-text-secondary);
  padding: 20px;
}

.error-state {
  color: #e74c3c;
  background-color: #fee;
  border: 1px solid #fcc;
}

.error-detail {
  font-size: 12px;
  margin-top: 8px;
  opacity: 0.8;
}

.loading {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.widget-frame {
  width: 100%;
  border: none;
  overflow: hidden;
  display: block;
}
</style>
