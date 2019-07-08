<template lang="pug">
a-upload-dragger(
  supportServerRender
  :accept="accept"
  :customRequest="upload"
  :remove="removeUploadedFile"
  @change="uploadStatusChanged"
).ele5
  font-awesome-icon(:icon="['fas', 'upload']" fixed-width style="font-size: 32px; margin-top: 16px; margin-bottom: 16px;")
  p.ant-upload-text(style="font-weight: bold;"): slot(name="text")
  p.ant-upload-hint(style="color: rgba(255, 255, 255, 0.3);")
    slot(name="hint")
</template>

<script>
import UploadMixin from '@/mixins/upload'
export default {
  mixins: [
    UploadMixin('packages', 'application/zip'),
  ],
  props: {
    accept: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    status: false,
  }),
  methods: {
    removeUploadedFile() {
      // TODO: request to remove the file from the server
    },
    uploadStatusChanged({ file }) {
      this.status = file.status === 'done'
    },
  }
}
</script>

<style lang="less">
.ant-upload.ant-upload-drag {
  transition: 0.2s @hoverEasing;
  border: none;
  background-color: #FF3CAC;
  background-image: linear-gradient(225deg, #FF3CAC 0%, #784BA0 50%, #2B86C5 100%);
  box-shadow: 0 0 0 0 hsla(226, 68%, 67%, 0.5);
  &:hover {
    transition: 0.2s @hoverEasing;
    box-shadow: 0 0 0 2px hsla(226, 68%, 67%, 0.5);
  }
}
</style>
