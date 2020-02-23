<i18n locale="en" src="@/locale/en/level_details.json" />
<i18n locale="zh-cn" src="@/locale/zh-CN/level_details.json" />
<i18n locale="zh-tw" src="@/locale/zh-TW/level_details.json" />

<template lang="pug">
  div
    div(style="color: rgba(255, 255, 255, 0.7); font-weight: bold; margin-bottom: 16px;")
      p(v-t="'manage.replace_title'")
    upload-level(slot="header" accept=".cytoidlevel"  :level="value")
      template(slot="text") {{$t('manage.replace_upload_title')}}
      template(slot="hint") {{$t('manage.replace_upload_subtitle')}}
    captcha(invisible badge="bottomleft")
    div(style="color: rgba(255, 255, 255, 0.7); font-weight: bold; margin-top: 16px; margin-bottom: 16px")
      p(v-t="'manage.metadata.title'")
    div
      .box
        a-form(:form="form")
          p.heading(style="margin-bottom: 4px;" v-t="'manage.metadata.id_field'")
          a-form-item
            a-input(:value="value.uid" disabled)
          p.heading(style="margin-bottom: 4px;" v-t="'manage.metadata.title_field'")
          a-form-item
            template(slot="extra") {{$t('manage.metadata.title_hint')}}
            a-input(v-decorator="formDecorator.title" disabled)
          p.heading(style="margin-bottom: 4px;" v-t="'manage.metadata.localized_title_field'")
          a-form-item
            div(slot="extra" v-t="'manage.metadata.localized_title_hint'")
            a-input(v-decorator="formDecorator.title_localized" disabled)
          p.heading(style="margin-bottom: 4px;" v-t="'manage.metadata.artist_field'")
          a-form-item
            div(slot="extra" v-t="'manage.metadata.artist_hint'")
            a-input(v-decorator="formDecorator.artist.name" disabled)
          p.heading(style="margin-bottom: 4px;" v-t="'manage.metadata.localized_artist_field'")
          a-form-item
            div(slot="extra" v-t="'manage.metadata.localized_artist_hint'")
            a-input(v-decorator="formDecorator.artist.name_localized" disabled)
          p.heading(style="margin-bottom: 4px;" v-t="'manage.metadata.music_url_field'")
          a-form-item
            div(slot="extra" v-t="'manage.metadata.music_url_hint'")
            a-input(v-decorator="formDecorator.artist.url" disabled)
          p.heading(style="margin-bottom: 4px;" v-t="'manage.metadata.cover_art_field'")
          a-form-item
            div(slot="extra" v-t="'manage.metadata.cover_art_hint'")
            a-input(v-decorator="formDecorator.illustrator.name" disabled)
          p.heading(style="margin-bottom: 4px;" v-t="'manage.metadata.cover_art_localized_field'")
          a-form-item
            div(slot="extra" v-t="'manage.metadata.cover_art_localized_hint'")
            a-input(v-decorator="formDecorator.illustrator.localized_name" disabled)
          p.heading(style="margin-bottom: 4px;" v-t="'manage.metadata.cover_art_url_field'")
          a-form-item
            div(slot="extra" v-t="'manage.metadata.cover_art_url_hint'")
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
            span(v-t="'save_btn'")
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
