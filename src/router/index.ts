import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/articles',
    name: 'ArticleList',
    component: () => import('@/views/ArticleList.vue'),
    meta: { title: '文章列表' }
  },
  {
    path: '/article/:id',
    name: 'ArticleDetail',
    component: () => import('@/views/ArticleDetail.vue'),
    meta: { title: '文章详情' }
  },
  {
    path: '/category/:id',
    name: 'Category',
    component: () => import('@/views/Category.vue'),
    meta: { title: '分类' }
  },
  {
    path: '/message',
    name: 'MessageBoard',
    component: () => import('@/views/MessageBoard.vue'),
    meta: { title: '留言板' }
  },
  {
    path: '/update-log',
    name: 'UpdateLog',
    component: () => import('@/views/UpdateLog.vue'),
    meta: { title: '更新日志' }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue'),
    meta: { title: '关于' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: { title: '404' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.afterEach((to) => {
  const title = to.meta.title as string | undefined
  const baseTitle = document.title.split(' - ').pop() || '星光小栈'
  document.title = title ? `${title} - ${baseTitle}` : baseTitle
})

export default router
