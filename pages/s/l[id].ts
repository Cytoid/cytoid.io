export default defineNuxtComponent({
  async setup() {
    const route = useRoute()
    const id = decompressLevelId(route.params.id.toString())

    let levelId = id.toString()

    try {
      const level = await $fetch<{ uid: string }>(
        useServiceUrl(`/levels/${id}`),
      )
      if (level?.uid) {
        levelId = level.uid
      }
    }
    catch (error) {
      console.error(error)
    }
    await navigateTo({
      name: 'levels-id',
      params: { id: levelId },
    })
  },
  render() {
    return null // This component doesn't render anything
  },
})
