<script setup>
import { onBeforeUnmount, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'

const route = useRoute()
const knownBodyClasses = [
  'page-home',
  'page-auth',
  'page-agreement',
  'page-dept',
  'page-dept-tech',
  'page-dept-network',
  'page-dept-planning',
  'page-dept-design',
]

function applyRouteMeta() {
  document.title = route.meta.title || 'TANEI·计算机社团'
  document.body.classList.remove(...knownBodyClasses)

  const classes = String(route.meta.bodyClass || '')
    .split(' ')
    .filter(Boolean)

  if (classes.length) {
    document.body.classList.add(...classes)
  }
}

watch(() => route.fullPath, applyRouteMeta, { immediate: true })

onBeforeUnmount(() => {
  document.body.classList.remove(...knownBodyClasses)
})
</script>

<template>
  <RouterView />
</template>
