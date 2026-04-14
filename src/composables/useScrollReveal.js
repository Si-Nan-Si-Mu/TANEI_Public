import { nextTick, onBeforeUnmount, onMounted } from 'vue'

export function useScrollReveal(selector = '.scroll-hidden') {
  let observer = null

  function observe() {
    if (!observer) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('show')
            }
          })
        },
        { threshold: 0.1 },
      )
    }

    document.querySelectorAll(selector).forEach((element) => {
      observer.observe(element)
    })
  }

  onMounted(async () => {
    await nextTick()
    observe()
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    observer = null
  })
}
