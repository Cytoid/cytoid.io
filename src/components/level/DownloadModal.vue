<template lang="pug" functional>
.modal-card
  header.modal-card-head
    p.modal-card-title Download {{props.level.title}}
  .modal-card-body.has-text-centered
    a.is-large.button.is-download(:href="props.url" :download="props.level.uid + '.cytoidlevel'")
      b-icon(icon="download")
      | Download
</template>

<script>
export default {
  name: 'DownloadLevelModal',
  props: {
    level: {
      type: Object,
      required: true,
    },
    url: {
      type: String,
      required: true,
    }
  }
}
</script>
