<template lang="pug">
  div(
    class="recent-comment ele3"
    style="position: relative; margin-top: 8px; padding: 12px 16px;"
  )
    a(:href="comment.url" style="padding-bottom: 4px; font-size: 12px;" v-text="comment.thread.clean_title")
    p(style="margin-bottom: 8px;") {{ comment.raw_message }}
    div(style="display: flex; position: relative; z-index: 2;")
      div(style="display: flex; font-size: 12px;")
        a.profile-link(
          :href="comment.author.profileUrl"
        )
          a-avatar(:size="24" :src="comment.author.avatar.large.cache" style="margin-right: 8px;")
          span(v-text="comment.author.name")
      div(style="display: flex; margin-left: auto;")
        span.card-secondary-text(style="font-size: 12px; padding-top: 1px;" v-text="readableDate(comment.createdAt).fromNow()")
</template>

<script>
import moment from 'moment'
import ScoreBadge from '@/components/level/ScoreBadge'
import DifficultyBadge from '@/components/level/DifficultyBadge'
export default {
  components: {
    ScoreBadge, DifficultyBadge
  },
  props: {
    comment: {
      type: Object,
      required: true,
    }
  },
  methods: {
    readableDate(date) {
      return moment(date)
    }
  }
}
</script>

<style lang="less">
  .recent-comment {
    background: @shade3;
    position: relative;
    border-radius: 4px;
    border-left: 4px solid rgba(255, 255, 255, 0.7);
    margin: 8px -8px;
    padding: 12px 24px 16px;
    transition: 0.2s @hoverEasing;
    overflow: hidden;

    &:hover {
      border-left: 4px solid rgba(255, 255, 255, 1);
    }

  }

</style>
