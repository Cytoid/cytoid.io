<template lang="pug">
div
  section.section: .container.has-text-white
    file-upload()
</template>

<script>
import FileUpload from '~/components/levels/FileUpload'
export default {
  name: 'NewLevel',
  components: {
    FileUpload,
  },
  data() {
    return {
      levelFile: null
    }
  },

}
</script>

<style scoped>

</style>
