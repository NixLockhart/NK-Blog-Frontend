import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

// 导入样式
import '@/styles/variables.css'
import '@/styles/main.css'
import '@/styles/markdown.css'
import 'katex/dist/katex.min.css'

// 根据主题动态导入代码高亮样式
import 'highlight.js/styles/github.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
