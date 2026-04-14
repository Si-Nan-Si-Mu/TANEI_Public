<script setup>
/** 退出登录页 | 更新时间: 2025-03-09 */
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
  await authStore.logout()
  router.replace('/')
})
</script>

<template>
  <div class="logout-placeholder">
    <p>正在退出...</p>
  </div>
</template>

<style scoped>
.logout-placeholder {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: var(--text-muted);
}
</style>
