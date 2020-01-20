<template functional lang="pug">
.card-wrap
  nuxt-link.card(:to="{ name: 'collections-id', params: { id: props.value.uid } }")
    .card-bg(:style="{backgroundImage: `url(${parent.$img(props.value.coverPath, { height: 500 })})`}")
    .card-content
      .top
        span.tag.is-white.is-light {{ props.value.levelCount }} levels
      .bottom
        .subtitle(v-text="props.value.slogan")
        .title(v-text="props.value.title")
        nuxt-link(
          v-if="props.value.owner"
          :to="{name: 'profile-id', params: { id: props.value.owner.uid || props.value.owner.id }}"
        )
          avatar(:size="24" fixed :src="props.value.owner.avatarURL" style="margin-right: 8px;")
          span(v-text="props.value.owner.name || props.value.owner.uid")
</template>

<script>
export default {
  name: 'CollectionSimpleCard',
  params: {
    value: {
      type: Object,
      required: true,
    }
  }
}
</script>

<style scoped lang="less">
@card-background-gutter: 1rem;
.card-wrap {
  position: relative;
  width: 100%;
  padding-top: 62.5%;
  &:hover {
    .card {
      transition: 0.4s @hoverEasing, box-shadow 0.4s @hoverEasing;
      box-shadow: @ele3; //rgba(255, 255, 255, 0.2) 0 0 40px 5px, white 0 0 0 1px, rgba(0, 0, 0, 0.66) 0 30px 60px 0, inset #333 0 0 0 5px, inset white 0 0 0 6px;
    }
    .card-bg {
      transition: 0.4s @hoverEasing, opacity 0.4s @hoverEasing;
      transform: scale(1.02, 1.02) translateX(var(--translate-x, 0)) translateY(var(--translate-y, 0));
      border-radius: 4px;
      // transform: scale(1.02, 1.02) translateX(var(--translate-x, 0)) translateY(var(--translate-y, 0));
      opacity: 0.8;
    }
  }
}
.card {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  flex: 0 0 240px;
  background-color: #333;
  overflow: hidden;
  border-radius: 4px;
  box-shadow: @ele2; //rgba(0, 0, 0, 0.66) 0 px 60px 0, inset #333 0 0 0 5px, inset rgba(255, 255, 255, 0.5) 0 0 0 6px;
  transition: 0.2s @returnEasing;
  &:active {
    transform: scale(0.98, 0.98);
  }
  padding: 16px;
  .card-bg {
    opacity: 0.5;
    position: absolute;
    top: -@card-background-gutter;
    left: -@card-background-gutter;
    width: 100%;
    height: 100%;
    padding: @card-background-gutter;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    transition: 0.2s @returnEasing, opacity 0.2s @returnEasing;
    pointer-events: none;
    box-sizing: unset;
  }
  .card-content {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
    user-select: none;
    text-shadow: @text-ele;
    line-height: 1.1;
    .top {
      flex-grow: 1;
    }
    .bottom {
      flex-grow: 0;
    }

    .title {
      font-size: 24px;
      font-weight: 300;
      color: white;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      margin-bottom: 0.5rem;
    }
    .subtitle {
      font-size: 14px;
      font-weight: 200;
      color: white;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      margin-bottom: 0.5rem;
    }
  }
}
</style>
