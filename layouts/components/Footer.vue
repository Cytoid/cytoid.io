<template functional lang="pug">
footer.footer
  .content.has-text-centered.has-text-white
    ul
      li: a(href='#') Terms &amp; Services
      li: a(href='#') Status
      li: a(href='https://github.com/tigerhix/cytoid') GitHub
    p.
      #[strong Cytoid] built by
      #[a(href='https://jgthms.com') Tiger Tang] and
      #[a(href='https://neoto.xin') Neo Zhang]
</template>

<style scoped lang="scss">
ul {
  list-style: none;
  li {
    display: inline;
    &:not(:first-child)::before {
      padding: 1rem;
      content: "|";
    }
  }
}
</style>
