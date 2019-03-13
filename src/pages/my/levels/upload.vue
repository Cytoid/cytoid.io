<template lang="pug">
section.section: .container
  .columns.is-centered
    #level-upload-container.column.is-half.has-text-white
      level-upload()
  .box This is the descriptions

</template>

<script>
import LevelUpload from '~/components/LevelUpload'
export default {
  name: 'NewLevel',
  components: {
    LevelUpload,
  },
  data() {
    return {
      levelFile: null
    }
  },

}
</script>

<style>
#level-upload-container .upload .upload-draggable{
  height: 20rem;
  display: block;
}
</style>
