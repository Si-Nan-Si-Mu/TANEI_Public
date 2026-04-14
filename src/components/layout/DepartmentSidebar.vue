<script setup>
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useRoute } from 'vue-router'

import { useUiStore } from '@/stores/ui'

const route = useRoute()
const uiStore = useUiStore()

const departmentLinks = [
  { label: '首页', to: '/' },
  { label: '技术部', to: '/departments/tech' },
  { label: '网络部', to: '/departments/network' },
  { label: '策联部', to: '/departments/planning' },
  { label: '概设部', to: '/departments/design' },
]

const sidebarClass = computed(() => ({
  'sidebar-collapsed': uiStore.isSidebarCollapsed,
}))

const toggleStyle = computed(() => ({
  transform: uiStore.isSidebarCollapsed ? 'rotate(0deg)' : 'rotate(45deg)',
}))

function syncViewport() {
  uiStore.syncSidebarWithViewport()
}

function isActive(to) {
  return route.path === to
}

onMounted(() => {
  syncViewport()
  window.addEventListener('resize', syncViewport)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', syncViewport)
})
</script>

<template>
  <div id="sidebar" class="glass" :class="sidebarClass">
    <div id="sidebar-toggle" :style="toggleStyle" @click="uiStore.toggleSidebar()">
      <span>+</span>
    </div>
    <div id="department">
      <h2>DEPT.</h2>
      <RouterLink
        v-for="item in departmentLinks"
        :key="item.label"
        :to="item.to"
        class="dept-link"
        :class="{ active: isActive(item.to) }"
      >
        {{ item.label }}
      </RouterLink>
    </div>
  </div>
</template>
