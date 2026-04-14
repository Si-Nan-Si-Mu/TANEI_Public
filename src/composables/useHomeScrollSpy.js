import { onBeforeUnmount, onMounted } from 'vue'

export function useHomeScrollSpy() {
  let isScrollingToTarget = false
  let onScroll = null

  function throttle(fn, delay) {
    let last = 0
    let timer = null

    return (...args) => {
      const now = Date.now()
      if (now - last >= delay) {
        last = now
        fn(...args)
        return
      }

      clearTimeout(timer)
      timer = setTimeout(() => {
        last = Date.now()
        fn(...args)
      }, delay)
    }
  }

  function updateActive() {
    if (isScrollingToTarget) return

    const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')]
    const sections = navLinks
      .map((link) => {
        const href = link.getAttribute('href')
        const id = href === '#' ? 'about' : href.slice(1)
        return document.getElementById(id)
      })
      .filter(Boolean)

    if (!sections.length) return

    const scrollTop = window.scrollY
    const offset = window.innerHeight * 0.3
    let current = sections[0]

    sections.forEach((section) => {
      if (section.offsetTop <= scrollTop + offset) {
        current = section
      }
    })

    navLinks.forEach((link) => {
      const href = link.getAttribute('href')
      link.classList.toggle(href === `#${current.id}` || (href === '#' && current.id === 'about'), 'active')
    })
  }

  function handleNavClick(event) {
    const anchor = event.target.closest('.site-nav a[href^="#"]')
    if (!anchor) return

    const href = anchor.getAttribute('href')
    if (href === '#') return

    const target = document.querySelector(href)
    if (!target) return

    event.preventDefault()
    document.querySelectorAll('.site-nav a[href^="#"]').forEach((link) => link.classList.remove('active'))
    anchor.classList.add('active')
    isScrollingToTarget = true

    const startTop = window.pageYOffset || document.documentElement.scrollTop
    const targetTop = target.getBoundingClientRect().top + startTop - 100
    const distance = targetTop - startTop
    const duration = 100
    let startTime = null

    function easeOutCubic(t) {
      return 1 - (1 - t) ** 3
    }

    function step(timestamp) {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      window.scrollTo(0, startTop + distance * easeOutCubic(progress))
      if (progress < 1) {
        requestAnimationFrame(step)
      } else {
        isScrollingToTarget = false
      }
    }

    requestAnimationFrame(step)
  }

  onMounted(() => {
    onScroll = throttle(updateActive, 100)
    window.addEventListener('scroll', onScroll)
    document.addEventListener('click', handleNavClick)
    updateActive()
  })

  onBeforeUnmount(() => {
    if (onScroll) {
      window.removeEventListener('scroll', onScroll)
    }
    document.removeEventListener('click', handleNavClick)
  })
}
