<script setup>
import { computed } from 'vue'

import DepartmentSidebar from '@/components/layout/DepartmentSidebar.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import SiteHeader from '@/components/layout/SiteHeader.vue'
import { useScrollReveal } from '@/composables/useScrollReveal'

const props = defineProps({
  logoSuffix: {
    type: String,
    required: true,
  },
  navItems: {
    type: Array,
    required: true,
  },
  heroClass: {
    type: String,
    default: '',
  },
  badge: {
    type: String,
    required: true,
  },
  titleHtml: {
    type: String,
    required: true,
  },
  lead: {
    type: String,
    required: true,
  },
  footerText: {
    type: String,
    required: true,
  },
  footerLinks: {
    type: Array,
    default: () => [{ label: '返回主站', to: '/' }],
  },
})

const heroClasses = computed(() => ['hero', props.heroClass].filter(Boolean))

useScrollReveal()
</script>

<template>
  <div class="full-height-layout">
    <SiteHeader :logo-suffix="logoSuffix" :nav-items="navItems" />

    <main>
      <section :class="heroClasses">
        <div class="container hero-inner scroll-hidden">
          <span class="badge">{{ badge }}</span>
          <h1 v-html="titleHtml" />
          <p class="lead">{{ lead }}</p>
        </div>
      </section>

      <DepartmentSidebar />

      <slot />
    </main>

    <SiteFooter left-title="TANEI" :left-text="footerText" :links="footerLinks" />
  </div>
</template>
