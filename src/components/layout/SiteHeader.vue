<script setup>
/** 顶部导航 - 含用户头像下拉菜单 | 更新时间: 2025-03-09 */
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

import { useAuthStore } from '@/stores/auth'

defineProps({
  logoSuffix: {
    type: String,
    default: 'TECH',
  },
  navItems: {
    type: Array,
    default: () => [],
  },
})

const authStore = useAuthStore()
const showUserMenu = ref(false)
const fallbackAvatar = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="50" fill="#e4e9f2"/>
  <circle cx="50" cy="38" r="14" fill="#c3cfe2"/>
  <ellipse cx="50" cy="82" rx="24" ry="16" fill="#c3cfe2"/>
</svg>
`.trim())}`

const avatarUrl = computed(() => {
  const avatar = authStore.currentUser?.avatar

  if (!avatar) return fallbackAvatar
  if (avatar.startsWith('http') || avatar.startsWith('data:') || avatar.startsWith('/api/')) return avatar
  if (avatar.startsWith('/')) return `/api${avatar}`

  return avatar
})

function onAvatarError(event) {
  if (event.target.src !== fallbackAvatar) {
    event.target.src = fallbackAvatar
  }
}

function closeUserMenu() {
  showUserMenu.value = false
}

function onDocumentClick(e) {
  if (showUserMenu.value && !e.target.closest('.header-user')) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
})
onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
})
</script>

<template>
  <header class="site-header glass">
    <div class="container header-inner">
      <RouterLink class="logo" to="/">
        <img class="logo-icon" src="/assets/favicon.svg" alt="TANEI" />
        TANEI.<span>{{ logoSuffix }}</span>
      </RouterLink>
      <nav class="site-nav">
        <template v-for="item in navItems" :key="item.label">
          <a
            v-if="item.href"
            :href="item.href"
            class="nav-link"
            :target="item.target"
            :rel="item.rel"
          >
            {{ item.label }}
          </a>
          <RouterLink v-else :to="item.to" class="nav-link">
            {{ item.label }}
          </RouterLink>
        </template>
        <div v-if="authStore.isAuthenticated" class="header-user">
          <button
            type="button"
            class="header-user-trigger"
            aria-haspopup="true"
            :aria-expanded="showUserMenu"
            @click="showUserMenu = !showUserMenu"
          >
            <img :src="avatarUrl" alt="" class="header-avatar" @error="onAvatarError" />
            <span class="header-username">{{ authStore.userName }}</span>
          </button>
          <div v-show="showUserMenu" class="header-user-menu" @click="closeUserMenu">
            <RouterLink to="/settings" class="header-user-item">设置</RouterLink>
            <RouterLink to="/logout" class="header-user-item">退出登录</RouterLink>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header-user {
  position: relative;
  margin-left: 24px;
  flex-shrink: 0;
}

.header-user-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border: none;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: background 0.2s;
  min-width: 0;
}

.header-user-trigger:hover {
  background: rgba(255, 255, 255, 0.9);
}

.header-avatar {
  display: block;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  background: rgba(195, 207, 226, 0.45);
}

.header-username {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-main);
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.header-user-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  min-width: 120px;
  padding: 8px 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.85);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  z-index: 20;
}

.header-user-item {
  display: block;
  padding: 10px 20px;
  font-size: 0.95rem;
  color: var(--text-main);
  text-decoration: none;
  transition: background 0.2s;
  white-space: nowrap;
}

.header-user-item:hover {
  background: rgba(43, 153, 231, 0.1);
  color: var(--primary);
}
</style>
