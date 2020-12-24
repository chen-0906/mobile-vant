import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name : 'login',
    // 路由懒加载
    component : () => import('@/views/login/')
  },
  {
    path: '/search',
    component: () => import('@/views/search/')
  },
  {
    path: '/',
    // 路由懒加载
    component : () => import('@/views/layout/'),
    children: [
      {
        path: '', // 默认子路由
        name: 'home',
        component: () => import('@/views/home/')
      },
      {
        path: '/qa',
        name: 'qa',
        component: () => import('@/views/qa/')
      },
      {
        path: '/video',
        name: 'video',
        component: () => import('@/views/video/')
      },
      {
        path: '/my',
        name: 'my',
        component: () => import('@/views/my/')
      }
    ]
  },
]

const router = new VueRouter({
  routes
})

export default router
