<template lang="pug">
  div
    div(style="color: rgba(255, 255, 255, 0.7); font-weight: bold; margin-bottom: 16px;")
      p(v-t="'manage.replace_title'")
    upload-level(:level="value")
      template(v-if="isQualified" slot="text") {{$t('manage.disqualified_replace_warning')}}
      template(v-else slot="text") {{$t('manage.replace_upload_title')}}
      template(slot="hint") {{$t('manage.replace_upload_subtitle')}}
    div(style="color: rgba(255, 255, 255, 0.7); font-weight: bold; margin-top: 16px; margin-bottom: 16px")
      p(v-t="'manage.metadata.title'")
    div
      .box
        form
          b-field(:label="$t('manage.metadata.id_field')")
            b-input(:value="value.uid" disabled)
          b-field(:label="$t('manage.metadata.title_field')" :addons="false")
            b-input(:value="value.title" disabled)
            p.help(v-t="'manage.metadata.title_hint'")
          b-field(:label="$t('manage.metadata.localized_title_field')"  :addons="false")
            b-input(:value="value.metadata.title_localized" disabled)
            p.help(v-t="'manage.metadata.localized_title_hint'")
          b-field(:label="$t('manage.metadata.artist_field')" :addons="false")
            b-input(:value="value.metadata.artist.name" disabled)
            p.help(v-t="'manage.metadata.artist_hint'")
          b-field(:label="$t('manage.metadata.localized_artist_field')" :addons="false")
            b-input(:value="value.metadata.artist.localized_name" disabled)
            p.help(v-t="'manage.metadata.localized_artist_hint'")
          b-field(:label="$t('manage.metadata.music_url_field')" :addons="false")
            b-input(:value="value.metadata.artist.url" disabled)
            p.help(v-t="'manage.metadata.music_url_hint'")
          b-field(:label="$t('manage.metadata.cover_art_field')" :addons="false")
            b-input(:value="value.metadata.illustrator.name" disabled)
            p.help(v-t="'manage.metadata.cover_art_hint'")
          b-field(:label="$t('manage.metadata.cover_art_localized_field')" :addons="false")
            b-input(:value="value.metadata.illustrator.localized_name" disabled)
            p.help(v-t="'manage.metadata.cover_art_localized_hint'")
          b-field(:label="$t('manage.metadata.cover_art_url_field')" :addons="false")
            b-input(:value="value.metadata.illustrator.url" disabled)
            p.help(v-t="'manage.metadata.cover_art_url_hint'")
          // TODO: Only show respective difficulty ratings if the level has that difficulty type available
          template(v-for="chart in value.charts")
            b-field(:label="chart.type + ' difficulty rating'")
              b-numberinput(:min="1" :max="15" :value="chart.difficulty" type="is-dark" disabled)
          p.help
            | Please follow the #[a(href="https://cytoid.io/posts/difficulty-v2") difficulty rating guidelines] when rating your charts.
          b-button(expanded disabled native-type="submit" icon-left="save" style="margin-top: 1rem;")
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
  computed: {
    isQualified: function () {
      return this.value.category.indexOf("qualified") > -1
    }
  },
  data () {
    return {
      easyDifficultyRating: 4,
      hardDifficultyRating: 6,
      extremeDifficultyRating: 12,
    }
  },
  i18n: {
    key: 'level_details'
  }
}
</script>
