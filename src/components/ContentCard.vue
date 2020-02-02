<template functional lang="pug">
  .a-card-wrap(ref="card")
    .a-card
      .card-bg(:style="{ backgroundImage: `url(${props.image})`}")
      nuxt-link.card-overlay(v-if="props.to" :to="props.to")
      .card-top
        slot(name="top")
      .card-bottom
        slot(name="bottom").text
        slot(name="action").action
</template>

<script>
export default {
  props: {
    image: {
      type: String,
      required: true,
    },
    to: {
      type: Object,
      required: false,
      default: null,
    }
  }
}
</script>

<style lang="less">
@card-background-gutter: 1rem;
.a-card-wrap {
  position: relative;
  width: 100%;
  padding-top: 62.5%;
  &:hover {
    .a-card {
      transition: 0.4s @hoverEasing, box-shadow 0.4s @hoverEasing;
      box-shadow: @ele3;
    }
    .card-bg {
      transition: 0.4s @hoverEasing, opacity 0.4s @hoverEasing;
      transform: scale(1.02, 1.02);
      border-radius: 4px;
      opacity: 0.8;
    }
  }
}
.a-card {
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
  .card-overlay {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    cursor: default;
  }
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

  display: flex;
  flex-direction: column;
  .control {
    z-index: 2;
    position: relative;
  }
  .card-top {
    color: white;
    position: relative;
  }
  .card-bottom {
    position: relative;
    flex-grow: 1;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    min-height: 0; // Without this, the container won't narrow past the implied height of the texts
    color: white;
    .info {
      flex-grow: 1;
      min-width: 0; // To make the texts shrink
      .title, .caption, .subtitle {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        margin-left: 0;
        margin-bottom: 4px;
        line-height: 1.1;
        text-shadow: @text-ele;
        user-select: none;
      }
      h1.title {
        font-size: 20px;
        font-weight: 300;
      }
      h2.subtitle {
        color: rgba(255, 255, 255, 0.7);
        font-size: 12px;
      }
      p.caption {
        color: rgba(255, 255, 255, 0.7);
      }
      .link {
        user-select: none;
        z-index: 2;
        position: relative;
        .cytoid-avatar {
          margin-right: 8px;
        }
      }
    }
  }
}
</style>
