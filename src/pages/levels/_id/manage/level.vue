<template lang="pug">
  div
    div(style="color: rgba(255, 255, 255, 0.7); font-weight: bold; margin-bottom: 16px;")
      p Replace
    upload-level(slot="header" accept=".cytoidlevel"  :level="value")
      template(slot="text") Click or drag a Cytoid level to this area
      template(slot="hint") Your level must have the same ID as the current one.
    captcha(invisible badge="bottomleft")
    div(style="color: rgba(255, 255, 255, 0.7); font-weight: bold; margin-top: 16px; margin-bottom: 16px")
      p Metadata
    div
      .box
        a-form(:form="form")
          p.heading(style="margin-bottom: 4px;") ID
          a-form-item
            a-input(:value="value.uid" disabled)
          p.heading(style="margin-bottom: 4px;") Title
          a-form-item
            template(slot="extra") The music title in its original form and language.
            a-input(v-decorator="formDecorator.title" disabled)
          p.heading(style="margin-bottom: 4px;") Localized title (optional)
          a-form-item
            div(slot="extra") The music title in English. Literal translation is preferred.
            a-input(v-decorator="formDecorator.title_localized" disabled)
          p.heading(style="margin-bottom: 4px;") Music artist name(s)
          a-form-item
            div(slot="extra") The music artist name(s) in their original form and language. Use a comma followed by a space to separate multiple names.
            a-input(v-decorator="formDecorator.artist.name" disabled)
          p.heading(style="margin-bottom: 4px;") Localized music artist name(s)
          a-form-item
            div(slot="extra") The music artist name(s) in English. Literal translation is preferred.
            a-input(v-decorator="formDecorator.artist.name_localized" disabled)
          p.heading(style="margin-bottom: 4px;") Music source URL
          a-form-item
            div(slot="extra") The music URL as posted by the artist(s). If there is no public URL, link to the official website of the work (i.e. game, anime) in which the music makes its first appearance.
            a-input(v-decorator="formDecorator.artist.url" disabled)
          p.heading(style="margin-bottom: 4px;") Cover artist name(s)
          a-form-item
            div(slot="extra") The cover artist name(s) in their original form and language. Use a comma followed by a space to separate multiple names.
            a-input(v-decorator="formDecorator.illustrator.name" disabled)
          p.heading(style="margin-bottom: 4px;") Localized cover artist name(s)
          a-form-item
            div(slot="extra") The cover artist name(s) in English. Literal translation is preferred.
            a-input(v-decorator="formDecorator.illustrator.localized_name" disabled)
          p.heading(style="margin-bottom: 4px;") Cover source URL
          a-form-item
            div(slot="extra") The cover art URL as posted by the artist(s). If there is no public URL, link to the official website of the work (i.e. game, anime) in which the cover is used.
            a-input(v-decorator="formDecorator.illustrator.url" disabled)
          // TODO: Only show respective difficulty ratings if the level has that difficulty type available
          template(v-for="chart in value.charts")
            p.heading(style="margin-bottom: 4px;") {{chart.type}} difficulty rating
            a-form-item
              a-input-number(:min="1" :max="15" :defaultValue="chart.difficulty" disabled)
          div(style="font-size: 12px; color: white;")
            | Please follow the #[a(href="https://cytoid.io/posts/difficulty-v2") difficulty rating guidelines] when rating your charts.
          a-button.card-button(block style="margin-top: 24px;" disabled html-type="submit")
            font-awesome-icon(icon="save" fixed-width style="margin-right: 4px;")
            span Save
</template>

<script>
import UploadLevel from '@/components/studio/UploadLevel'
export default {
  name: 'LevelManageEditor',
  background: null,
  components: {
    UploadLevel
  },
  props: {
    value: {
      type: Object,
      required: true,
    }
  },
  data() {
    const formDecorator = {
      title: [
        'title',
        {
          initialValue: this.value.title,
          rules: [{ required: true, message: 'Please specify the title' }],
        }
      ],
      localized_title: [
        'title_localized',
        { initialValue: this.value.metadata.title_localized }
      ],
      artist: {
        name: [
          'artist',
          {
            initialValue: this.value.metadata.artist.name,
            rules: [{ required: true, message: 'Please specify the name of the artist' }],
          }
        ],
        name_localized: [
          'artist_name_localized',
          { initialValue: this.value.metadata.artist.localized_name }
        ],
        url: [
          'artist_url',
          { initialValue: this.value.metadata.artist.url }
        ]
      },
      illustrator: {
        name: [
          'artist',
          {
            initialValue: this.value.metadata.illustrator.name,
            rules: [{ required: true, message: 'Please specify the name of the artist' }],
          }
        ],
        name_localized: [
          'artist_name_localized',
          { initialValue: this.value.metadata.illustrator.localized_name }
        ],
        url: [
          'artist_url',
          { initialValue: this.value.metadata.illustrator.url }
        ]
      },
    }
    return {
      easyDifficultyRating: 4,
      hardDifficultyRating: 6,
      extremeDifficultyRating: 12,
      form: this.$form.createForm(this),
      formDecorator: formDecorator,
    }
  },
}
</script>

<style lang="less" scoped>
  .ant-card {
    margin-bottom: 16px;
  }
</style>
