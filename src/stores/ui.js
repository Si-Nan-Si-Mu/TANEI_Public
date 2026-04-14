import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    isSidebarCollapsed: true,
  }),
  actions: {
    syncSidebarWithViewport() {
      this.isSidebarCollapsed = window.innerWidth <= 768
    },
    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed
    },
  },
})
