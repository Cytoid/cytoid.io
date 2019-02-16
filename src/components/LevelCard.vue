<template lang="pug">
  div(class="card")
    div(class="cover-container")
      img(class="card-img unselectable", :src="backgroundURL")
    nuxt-link(:to="'/levels/' + level.id")
      div(class="card-img-overlay cover")
    div(class="card-img-overlay unselectable")
      div(class="m-l-lg m-t-sm")
        div(class="time-text unselectable m-b-none m-r-none m-l-none is-pulled-left")
          | 2 days ago
    div(class="m-t-md m-r-md")
      div(class="unselectable m-b-none m-r-none m-l-none is-pulled-right")
    div(class="cover-overlay")
      div(class="m-b-lg")
      h4(class="trun-text m-b-sm")
        | {{level.title}}
        span {{level.metadata.artist.name}}
    div(class="columns is-flex flex-nowrap")
      div(class="m-b-none column")
        nuxt-link(:to="'/profile/' + level.owner.name", class="avatar")
          img(class="is-rounded avatar-img", src="https://cytoid.io/io.png")
          span(class="is-vcentered uploader-text")
          | level.owner.name
</template>

<script>
export default {
  props: {
    level: {
      default: () => ({
        title: 'Loading...',

      }),
      type: Object
    }
  },
  computed: {
    backgroundURL() {
      return process.env.assetURL + this.level.background
    }
  }
}
</script>

<style scoped>
  .card {
    border-radius: 4px;
    box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, .05);
    padding: 0;
  }
  .card-img {
    border-radius: 4px;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
  }
  .card-img-overlay {
    position:absolute;
    top:0;
    right:0;
    bottom:0;
    left:0;
    padding:0;
  }
  .cover {
    background: rgba(0, 0, 0, 0.25);
    transition: all .25s ease-in-out;
    position: absolute;
    width: 100%;
    border-radius: 4px;
  }
  .cover-container {
    width: 100%;
    padding-top: 62.5% !important;
  }
  .cover-overlay {
    position: absolute;
    bottom: 0;
    width: 100%;
    background: linear-gradient(to top, rgba(0,0,0,0.5) 0%,rgba(0,0,0,0) 100%);
    pointer-events: none;
    border-radius: 4px;
    padding: 1em
  }
  .avatar {
    pointer-events: auto; cursor: default; color: #fff; text-decoration: none; white-space: nowrap;
  }
  .avatar-img {
    max-width:none;width:25px;height:25px;
  }
  .unselectable {
    user-select: none;
    pointer-events: none;
  }
  .time-text {
    font-size: 14px;
  }
  .trun-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
    max-width: 100%;
  }
  .uploader-text {
    font-size: 14px; padding-left: 6px; text-decoration: none;
  }
  .flex-nowrap {
    flex-wrap: nowrap !important;
  }
</style>
