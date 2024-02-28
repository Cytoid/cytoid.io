export default defineComponent({
  async setup() {
    const route = useRoute()
    const uid = route.params.uid.toString()
    const { chartId, recordId } = decompressRecordId(uid)
    await navigateTo({
      name: 'records-chartId-id',
      params: { chartId, id: recordId },
    })
  },
  render() {
    return null // This component doesn't render anything
  },
})
