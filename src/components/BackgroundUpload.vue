<template functional lang="pug">
  a-upload-dragger.header-uploader(
    name="header"
    :showUploadList="true"
    :customRequest="parent.upload"
    @change="listeners.change"
    :style="props.src && { '--bg-url': `url(\"${props.src}\")` }"
  )
    p.ant-upload-drag-icon
      font-awesome-icon(icon="upload" size="3x")
    p.ant-upload-text(v-text="props.title || parent.$t('file_upload_default_title')")
    p.ant-upload-hint(v-text="props.hint || parent.$t('file_upload_default_subtitle')")
</template>

<script>
export default {
  name: 'BackgroundUpload',
  props: {
    title: {
      type: String,
      default: null,
    },
    hint: {
      type: String,
      default: null,
    },
    src: {
      type: String,
      required: false,
      default: null,
    }
  },
}
</script>

<style lang="less">
  .header-uploader .ant-upload.ant-upload-drag {
    background-size: cover;
    background-position: center;
    background-image: var(--bg-url);
  }
</style>
