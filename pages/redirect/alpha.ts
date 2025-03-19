export default defineNuxtComponent({
  setup() {
    navigateTo('https://next.cytoid.io', { external: true })
  },

  // This component doesn't render anything
  render: () => null,
})
