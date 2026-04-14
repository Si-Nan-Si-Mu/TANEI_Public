<script setup>
import { RouterLink } from 'vue-router'

const props = defineProps({
  leftTitle: {
    type: String,
    default: 'TANEI',
  },
  leftText: {
    type: String,
    default: '',
  },
  links: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <footer class="site-footer">
    <div class="container footer-inner">
      <div class="footer-left">
        <h3 class="logo">{{ props.leftTitle }}</h3>
        <p>{{ props.leftText }}</p>
      </div>
      <div class="footer-right">
        <template v-for="link in props.links" :key="link.label">
          <a
            v-if="link.href"
            :href="link.href"
            :target="link.target"
            :rel="link.rel"
          >
            {{ link.label }}
          </a>
          <RouterLink v-else :to="link.to">
            {{ link.label }}
          </RouterLink>
        </template>
      </div>
    </div>
  </footer>
</template>
