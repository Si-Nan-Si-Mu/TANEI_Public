/** 路由配置与权限守卫 | 更新时间: 2025-03-09 */
import { createRouter, createWebHistory } from 'vue-router'

import AgreementPage from '@/pages/AgreementPage.vue'
import HomePage from '@/pages/HomePage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import LogoutPage from '@/pages/LogoutPage.vue'
import RegisterPage from '@/pages/RegisterPage.vue'
import SettingsPage from '@/pages/SettingsPage.vue'
import DesignDepartmentPage from '@/pages/departments/DesignDepartmentPage.vue'
import NetworkDepartmentPage from '@/pages/departments/NetworkDepartmentPage.vue'
import PlanningDepartmentPage from '@/pages/departments/PlanningDepartmentPage.vue'
import TechDepartmentPage from '@/pages/departments/TechDepartmentPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
      meta: {
        title: 'TANEI·计算机社团',
        bodyClass: 'page-home',
      },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
      meta: {
        title: '用户登录 · TANEI',
        bodyClass: 'page-auth',
      },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterPage,
      meta: {
        title: '用户注册 · TANEI',
        bodyClass: 'page-auth',
      },
    },
    {
      path: '/agreement',
      name: 'agreement',
      component: AgreementPage,
      meta: {
        title: '用户协议 · TANEI',
        bodyClass: 'page-agreement',
      },
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsPage,
      meta: {
        title: '个人设置 · TANEI',
        bodyClass: 'page-auth',
        requiresAuth: true,
      },
    },
    {
      path: '/logout',
      name: 'logout',
      component: LogoutPage,
      meta: { title: '退出中 · TANEI' },
    },
    {
      path: '/departments/tech',
      name: 'department-tech',
      component: TechDepartmentPage,
      meta: {
        title: '技术部 - TANEI',
        bodyClass: 'page-dept page-dept-tech',
      },
    },
    {
      path: '/departments/network',
      name: 'department-network',
      component: NetworkDepartmentPage,
      meta: {
        title: '网络部 - TANEI',
        bodyClass: 'page-dept page-dept-network',
      },
    },
    {
      path: '/departments/planning',
      name: 'department-planning',
      component: PlanningDepartmentPage,
      meta: {
        title: '策联部 - TANEI',
        bodyClass: 'page-dept page-dept-planning',
      },
    },
    {
      path: '/departments/design',
      name: 'department-design',
      component: DesignDepartmentPage,
      meta: {
        title: '概设部 - TANEI',
        bodyClass: 'page-dept page-dept-design',
      },
    },
  ],
  scrollBehavior(to) {
    if (to.hash) {
      return {
        el: to.hash,
        top: 100,
        behavior: 'smooth',
      }
    }

    return { top: 0 }
  },
})

router.beforeEach(async (to, _from, next) => {
  if (!to.meta.requiresAuth) {
    next()
    return
  }
  const { useAuthStore } = await import('@/stores/auth')
  const authStore = useAuthStore()
  while (authStore.isHydratingSession) {
    await new Promise((r) => setTimeout(r, 50))
  }
  if (!authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }
  next()
})

export default router
