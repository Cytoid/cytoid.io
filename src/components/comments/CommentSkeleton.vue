<template functional lang="pug">
article.media.comment
  figure.media-left
    .image.is-32x32
      b-skeleton(circle width="32px" height="32px")
  .media-content
    .content
      b-skeleton(width="120px")
      b-skeleton(height="30px")
    .level.is-mobile
      .level-left
        a.level-item(v-for="i in 3" :key="i")
          .icon.is-small
            b-skeleton
</template>
