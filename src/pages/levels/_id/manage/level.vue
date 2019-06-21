<template lang="pug">
  div
    div(style="color: rgba(255, 255, 255, 0.7); font-weight: bold; margin-bottom: 16px;")
      p Replace
    upload-level(slot="header" accept=".cytoidlevel" type="package")
      template(slot="text") Click or drag a Cytoid level to this area
      template(slot="hint") Your level must have the same ID as the current one.
    div(style="color: rgba(255, 255, 255, 0.7); font-weight: bold; margin-top: 16px; margin-bottom: 16px")
      p Metadata
    div
      a-card.ele3
        a-form(:form="form")
          p.heading(style="margin-bottom: 4px;") ID
            a-form-item
              a-input(value="io.cytoid.glow_dance" disabled)
          p.heading(style="margin-bottom: 4px;") Title
          a-form-item
            div(slot="extra") The music title in its original form and language.
            a-input(value="Glow Dance")
          p.heading(style="margin-bottom: 4px;") Localized title (optional)
          a-form-item
            div(slot="extra") The music title in English. Literal translation is preferred.
            a-input(value="")
          p.heading(style="margin-bottom: 4px;") Music artist name(s)
          a-form-item
            div(slot="extra") The music artist name(s) in their original form and language. Use a comma followed by a space to separate multiple names.
            a-input(value="iamMANOLIS")
          p.heading(style="margin-bottom: 4px;") Localized music artist name(s)
          a-form-item
            div(slot="extra") The music artist name(s) in English. Literal translation is preferred.
            a-input(value="")
          p.heading(style="margin-bottom: 4px;") Music source URL
          a-form-item
            div(slot="extra") The music URL as posted by the artist(s). If there is no public URL, link to the official website of the work (i.e. game, anime) in which the music makes its first appearance.
            a-input(value="")
          p.heading(style="margin-bottom: 4px;") Cover artist name(s)
          a-form-item
            div(slot="extra") The cover artist name(s) in their original form and language. Use a comma followed by a space to separate multiple names.
            a-input(value="iamMANOLIS")
          p.heading(style="margin-bottom: 4px;") Localized cover artist name(s)
          a-form-item
            div(slot="extra") The cover artist name(s) in English. Literal translation is preferred.
            a-input(value="")
          p.heading(style="margin-bottom: 4px;") Cover source URL
          a-form-item
            div(slot="extra") The cover art URL as posted by the artist(s). If there is no public URL, link to the official website of the work (i.e. game, anime) in which the cover is used.
            a-input(value="")
          // TODO: Only show respective difficulty ratings if the level has that difficulty type available
          p.heading(style="margin-bottom: 4px;") Easy difficulty rating
          a-form-item
            a-select(v-model="easyDifficultyRating")
              a-select-option(v-for="rating in Array(15).keys()" :value="rating")
                span {{ rating }}
              a-select-option(value="15+")
                span 15+
          p.heading(style="margin-bottom: 4px;") Hard difficulty rating
          a-form-item
            a-select(v-model="hardDifficultyRating")
              a-select-option(v-for="rating in Array(15).keys()" :value="rating")
                span {{ rating }}
              a-select-option(value="15+")
                span 15+
          p.heading(style="margin-bottom: 4px;") Extreme difficulty rating
          a-form-item
            a-select(v-model="extremeDifficultyRating")
              a-select-option(v-for="rating in Array(15).keys()" :value="rating")
                span {{ rating }}
              a-select-option(value="15+")
                span 15+
          div(style="font-size: 12px; color: white;")
            | Please follow the #[a(href="https://cytoid.io/posts/difficulty-v2") difficulty rating guidelines] when rating your charts.
          a-button(class="card-button" style="width: 100%; margin-top: 24px;")
            font-awesome-icon(icon="save" fixed-width style="margin-right: 4px;")
            span Save
</template>

<script>
import UploadLevel from '@/components/studio/UploadLevel'
export default {
  name: 'LevelManageEditor',
  layout: 'background',
  components: {
    UploadLevel
  },
  data() {
    return {
      easyDifficultyRating: 4,
      hardDifficultyRating: 6,
      extremeDifficultyRating: 12,
      form: this.$form.createForm(this),
    }
  },
  asyncData({ $axios, params, store }) {
    return Promise.all([
      $axios.get('/levels/' + params.id),
      $axios.get(`/levels/${params.id}/ratings`)
    ])
      .then(([levelResponse, ratingResponse]) => {
        store.commit('setBackground', { source: levelResponse.data.bundle.background })
        return {
          level: levelResponse.data,
          ratings: ratingResponse.data,
        }
      })
  },
}
</script>

<style lang="less" scoped>
  .ant-card {
    margin-bottom: 16px;
  }
</style>
