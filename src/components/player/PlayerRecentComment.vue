<template lang="pug" functional>
  .recent-comment.ele3(
    style="position: relative; margin-top: 8px; padding: 12px 16px;"
  )
    nuxt-link(
      v-if="props.comment.metadata && props.comment.metadata.path && props.comment.metadata.title"
      :to="props.comment.metadata.path" style="padding-bottom: 4px; font-size: 12px;"
      v-text="props.comment.metadata.title")
    span(
      style="padding-bottom: 4px; font-size: 12px;"
      v-else-if="props.comment.metadata && props.comment.metadata.title"
      v-text="props.comment.metadata.title"
    )
    p.content(style="margin-bottom: 0.5rem; max-height: 3em; overflow: hidden;" v-text="props.comment.content")
    div(style="display: flex; position: relative; z-index: 2;")
      div(style="display: flex; font-size: 12px;")
        nuxt-link.profile-link(:to="{ name: 'profile-id', params: { id: props.comment.owner.uid } }" v-if="props.comment.owner")
          avatar(:size="24" fixed :src="props.comment.owner.avatar && props.comment.owner.avatar.small" style="margin-right: 8px;")
          span(v-text="props.comment.owner.name || props.comment.owner.uid")
        .profile-link(v-else)
          avatar(:size="24" fixed style="margin-right: 8px;")
          span(v-if="props.comment.metadata && props.comment.metadata.disqusUser") Disqus user {{props.comment.metadata.disqusUser.name}}
          span(v-else) Anonymous
      div(style="display: flex; margin-left: auto;")
        span.card-secondary-text(style="font-size: 12px; padding-top: 1px;" v-text="parent.$dateFromNow(props.comment.date)")
</template>

<script>
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
}
</script>

<style lang="scss">
  .recent-comment {
    background: $grey;
    position: relative;
    border-radius: 4px;
    border-left: 4px solid rgba(255, 255, 255, 0.7);
    margin: 8px -8px;
    padding: 12px 24px 16px;
    transition: 0.2s $hoverEasing;
    overflow: hidden;

    &:hover {
      border-left: 4px solid rgba(255, 255, 255, 1);
    }

  }

</style>
