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
    p.ant-upload-text(v-text="props.title")
    p.ant-upload-hint(v-text="props.hint")
</template>

<script>
export default {
  name: 'BackgroundUpload',
  props: {
    title: {
      type: String,
      default: 'File Upload',
    },
    hint: {
      type: String,
      default: 'Click or drag the file to this area to upload',
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
