/** 根据登录状态返回导航项 | 更新时间: 2025-03-09 */
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

/**
 * 根据登录状态返回导航项，末尾自动附加 设置/退出 或 登录/注册
 * @param {Array} baseItems - 基础导航项
 * @returns {import('vue').ComputedRef<Array>}
 */
export function useAppNavItems(baseItems) {
  const authStore = useAuthStore()
  return computed(() => {
    const items = [...baseItems]
    if (authStore.isAuthenticated) {
      items.push({ label: '设置', to: '/settings' })
      items.push({ label: '退出', to: '/logout' })
    } else {
      items.push({ label: '登录', to: '/login' })
      items.push({ label: '注册', to: '/register' })
    }
    return items
  })
}
