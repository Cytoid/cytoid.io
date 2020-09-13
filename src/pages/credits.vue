<template lang="pug">
.container
  .columns
    .column.is-offset-one-quarter.is-half
      img.credits-hero(src="https://artifacts.cytoid.io/logo.png")
  p.credits-title
    | A community-driven music game
  template(v-for="section in content")
    div(style="margin-bottom: 4rem;" v-if="!section.title")
    .columns.is-mobile(v-else style="margin-bottom: 0;")
      .column.has-text-right
        .credits-section-heading {{section.title}}
      .column
        .text-left.text-sm.pb-0-5.opacity-100(v-for="member in section.members") {{member}}
  p.section.has-text-centered
    | We would like to thank our {{patronsCount}} patrons who donated to keep our servers alive.
  .section
    nuxt-link.patron(v-for="patron in patrons" :to="{ name: 'profile-id', params: { id: patron.owner.uid } }" :key="patron.id")
      img.cytoid-avatar(:src="patron.owner.avatar.small")
      span.name {{patron.owner.name || patron.owner.uid}}
      span.quote {{patron.quote}}
  p.section.has-text-centered
    | Thank you for playing.
</template>

<script>
export default {
  asyncData ({ $axios }) {
    return $axios.get('/creditmeta')
      .then(res => res.data)
  },
  data () {
    return {
      patronsCount: 0,
      patrons: [],
      content: []
    }
  },
}
</script>

<style scoped>
.credits-hero {
  width: 100%;
  display: block;
  margin-top: 4rem;
}
.credits-title {
  text-align: center;
  font-size: 1.25rem;
  margin-bottom: 12rem;
}
.credits-section-heading {
  opacity: 0.7;
  letter-spacing: 0.15rem;
}

.patron {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}
.patron .name {
  font-weight: bold;
  margin-left: 1rem;
}
.patron .quote {
  opacity: 0.7;
  margin-left: 1rem;
}

.patron .cytoid-avatar {
  height: 32px;
  width: 32px;
}
</style>
