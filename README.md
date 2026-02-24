# 星光小栈 2.0 - 博客前端

星光小栈个人博客系统的前端部分，基于 Vue 3 + TypeScript + Vite 构建的单页应用，是对 [1.0 JSP 版本](https://github.com/NixLockhart/personal_blog) 的完全重构。

![Vue](https://img.shields.io/badge/Vue-3.5-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Vite](https://img.shields.io/badge/Vite-7.2-purple)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 简介

星光小栈 2.0 前端采用前后端分离架构，通过 RESTful API 与 Spring Boot 后端通信。相比 1.0 版本的 JSP 服务端渲染，2.0 实现了组件化开发、动态主题系统、Markdown 渲染、AI 助手集成等现代化特性。

## 功能特性

### 核心功能

| 功能 | 说明 |
|------|------|
| **文章浏览** | 文章列表、详情页，支持分类筛选和关键词搜索 |
| **Markdown 渲染** | 基于 markdown-it，支持代码高亮、LaTeX 数学公式、多列表格 |
| **动态主题** | 亮色/暗色模式切换，支持从后端加载自定义主题 CSS |
| **评论系统** | 文章评论与嵌套回复，支持头像上传和 Markdown 格式 |
| **留言板** | 访客留言与友链展示 |
| **侧边栏小工具** | 动态加载后端配置的小工具（日历、每日诗词等） |
| **公告轮播** | 全局公告栏，支持多条公告自动轮播 |
| **骨架屏** | 文章卡片、详情页、时间线等加载状态的骨架屏占位 |
| **响应式布局** | 适配桌面端、平板和移动端 |

### 页面说明

| 页面 | 路由 | 功能描述 |
|------|------|----------|
| **首页** | `/` | 热门文章、最新文章、侧边栏小工具 |
| **文章列表** | `/articles` | 分页文章列表，支持分类筛选和搜索 |
| **文章内容** | `/article/:id` | Markdown 渲染、目录导航、点赞、评论 |
| **分类** | `/category/:id` | 按分类查看文章 |
| **留言板** | `/message` | 访客留言、友情链接 |
| **更新日志** | `/update-log` | 版本更新时间线 |
| **关于** | `/about` | 站点信息、技术栈、统计数据 |

## 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 框架 | Vue | 3.5 |
| 语言 | TypeScript | 5.9 |
| 构建工具 | Vite | 7.2 |
| 状态管理 | Pinia | 3.0 |
| 路由 | Vue Router | 4.6 (History 模式) |
| HTTP 客户端 | Axios | 1.13 |
| Markdown | markdown-it + 插件 (anchor, toc, multimd-table) | 14.1 |
| 代码高亮 | highlight.js | 11.11 |
| 数学公式 | KaTeX | 0.16 |
| 工具库 | @vueuse/core, dayjs, DOMPurify | - |
| 样式 | CSS Variables + Scoped CSS | - |

## 工程结构

```
blog-frontend/
├── public/                          # 静态资源（原样复制到 dist）
│   ├── beian.png                    # 备案图标
│   ├── nk.svg                       # 网站 favicon
│   └── robots.txt                   # SEO 爬虫规则
├── src/
│   ├── main.ts                      # 应用入口，插件注册
│   ├── App.vue                      # 根组件，全局布局
│   ├── api/                         # API 请求层
│   │   ├── article.ts               # 文章 API
│   │   ├── category.ts              # 分类 API
│   │   ├── comment.ts               # 评论 API
│   │   ├── message.ts               # 留言 API
│   │   ├── config.ts                # 站点配置 API
│   │   ├── theme.ts                 # 主题 API
│   │   ├── widget.ts                # 小工具 API
│   │   └── ai.ts                    # DIFY-AI 助手 API (SSE 流式)
│   ├── components/                  # 组件
│   │   ├── layout/                  # 布局组件
│   │   │   ├── Header.vue           # 导航栏、搜索、主题切换
│   │   │   ├── Footer.vue           # 页脚、备案信息
│   │   │   └── Announcement.vue     # 公告轮播栏
│   │   ├── article/                 # 文章相关
│   │   │   ├── ArticleCard.vue      # 文章卡片
│   │   │   └── ArticleToc.vue       # 文章目录导航
│   │   ├── comment/                 # 评论相关
│   │   │   ├── CommentForm.vue      # 评论表单
│   │   │   ├── CommentItem.vue      # 评论项
│   │   │   └── CommentList.vue      # 评论列表
│   │   ├── message/                 # 留言相关
│   │   │   ├── MessageForm.vue      # 留言表单
│   │   │   ├── MessageList.vue      # 留言列表
│   │   │   └── FriendLinks.vue      # 友情链接
│   │   ├── ai-assistant/            # AI 助手
│   │   │   ├── AIAssistant.vue      # 悬浮入口
│   │   │   ├── AIChat.vue           # 聊天界面
│   │   │   ├── AIMessage.vue        # 消息气泡
│   │   │   └── markdown.ts          # AI 消息 Markdown 渲染
│   │   ├── widgets/                 # 侧边栏小工具
│   │   │   ├── DynamicWidget.vue    # 动态小工具加载器
│   │   │   ├── Calendar.vue         # 日历组件
│   │   │   └── Poem.vue             # 每日诗词
│   │   ├── home/                    # 首页专属组件
│   │   │   ├── Contact.vue          # 联系方式
│   │   │   ├── Follow.vue           # 社交媒体链接
│   │   │   └── OpenSource.vue       # 开源项目展示
│   │   └── skeleton/                # 骨架屏组件
│   │       ├── SkeletonBlock.vue    # 基础骨架块
│   │       ├── ArticleCardSkeleton.vue # 文章卡片骨架屏
│   │       ├── ArticleDetailSkeleton.vue # 文章详情骨架屏
│   │       └── TimelineSkeleton.vue # 时间线骨架屏
│   ├── views/                       # 页面视图
│   │   ├── Home.vue                 # 首页
│   │   ├── ArticleList.vue          # 文章列表页
│   │   ├── ArticleDetail.vue        # 文章详情页
│   │   ├── Category.vue             # 分类页
│   │   ├── MessageBoard.vue         # 留言板页
│   │   ├── UpdateLog.vue            # 更新日志页
│   │   ├── About.vue                # 关于页
│   │   └── NotFound.vue             # 404 页
│   ├── stores/                      # Pinia 状态管理
│   │   ├── app.ts                   # 站点配置、公告
│   │   └── theme.ts                 # 主题模式、动态 CSS 加载
│   ├── composables/                 # 组合式函数
│   │   ├── useMarkdown.ts           # Markdown 渲染（文章/评论）
│   │   ├── usePageTitle.ts          # 动态页面标题
│   │   └── useVisitorId.ts          # 访客 ID 生成
│   ├── config/                      # 配置
│   │   ├── env.ts                   # 环境变量统一导出
│   │   └── ai.ts                    # AI 助手配置
│   ├── types/                       # TypeScript 类型定义
│   │   └── index.ts                 # 全局类型
│   ├── utils/                       # 工具函数
│   │   ├── request.ts               # Axios 实例封装
│   │   ├── file.ts                  # 文件 URL 处理
│   │   ├── latex.ts                 # LaTeX 公式处理
│   │   └── throttle.ts              # 节流函数
│   ├── styles/                      # 全局样式
│   │   ├── variables.css            # CSS 变量定义
│   │   ├── main.css                 # 全局样式
│   │   └── markdown.css             # Markdown 渲染样式
│   └── router/
│       └── index.ts                 # 路由配置
├── .env                             # 基础环境变量
├── .env.development                 # 开发环境配置
├── .env.production                  # 生产环境配置
├── .env.production.example          # 生产环境配置模板
├── index.html                       # Vite 入口 HTML
├── package.json                     # 依赖配置
├── tsconfig.json                    # TypeScript 配置
├── tsconfig.app.json                # 应用 TS 配置
├── tsconfig.node.json               # Node 端 TS 配置
└── vite.config.ts                   # Vite 构建配置
```

## 快速开始

### 环境要求

- Node.js 18+
- npm 9+

### 安装步骤

```bash
# 1. 进入前端目录
cd blog-frontend

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev
```

开发服务器启动后访问 `http://localhost:5173`。

### 环境变量配置

复制 `.env.production.example` 为 `.env.production` 并修改：

```bash
# API 路径前缀
VITE_API_BASE_URL=/api

# 后端服务器基础 URL
# 同域部署：留空
# 分离部署：填写后端完整地址，如 https://api.yourdomain.com
VITE_BASE_URL=

# 网站标题
VITE_APP_TITLE=星光小栈
```

开发环境下 `.env.development` 默认配置后端地址为 `http://localhost:8080`。

### 构建与部署

```bash
# 构建生产版本
npm run build

# 本地预览构建产物
npm run preview
```

构建产物输出到 `dist/` 目录，部署时配合 Nginx 将 API 请求代理到后端即可。

**Nginx 参考配置：**

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # 前端静态资源
    location / {
        root /path/to/dist;
        try_files $uri $uri/ /index.html;
    }

    # API 代理
    location /api/ {
        proxy_pass http://localhost:8080;
    }

    # 静态文件（上传的图片等）
    location /files/ {
        proxy_pass http://localhost:8080;
    }
}
```

## 与 1.0 版本的主要区别

| 对比项 | 1.0 | 2.0 |
|--------|----------------|-----------------|
| 前端架构 | JSP 服务端渲染 | Vue 3 SPA 前后端分离 |
| 样式方案 | 原生 CSS | CSS Variables + 动态主题系统 |
| 语言 | JavaScript | TypeScript |
| 状态管理 | 无 | Pinia |
| 文章渲染 | 后端渲染 HTML | 前端 Markdown 实时渲染 |
| 主题切换 | 不支持 | 亮色/暗色 + 后端可配主题 |
| 移动端适配 | 基础响应式 | 完整响应式布局 |
| 加载体验 | 页面刷新 | SPA 路由 + 骨架屏 |

## 版本历史

- **V2.0.5** (2026-2)

  - AI 助手集成（DIFY SSE 流式对话）


- **V2.0.0** (2025-11)
  - Vue 3 + TypeScript + Vite 全面重构
  - 前后端分离架构，RESTful API 通信
  - Pinia 状态管理
  - Markdown 前端渲染（代码高亮、LaTeX、目录导航）
  - 动态主题系统（亮/暗模式 + 自定义主题 CSS）
  - 完整移动端响应式适配
  - 侧边栏动态小工具（日历、诗词等）
  - 评论与留言系统

- **V1.0.2** (2025-06)
  - 基于 Java Servlet/JSP 的传统博客系统
  - 仓库地址：[personal_blog](https://github.com/NixLockhart/personal_blog)

## 许可证

MIT License

## 作者

NixStudio (Nix Lockhart)
