<template lang="pug">
.container
  .section: .sorry-img
    img(:src="require('@/assets/images/sayakacry.png')")
  .section: .container.error-texts
    h1(v-t="'404_title'")
    .single-line
      p(v-t="{path: 'error_content', args: { error: message }}")
    .multi-line
      p(v-t="{path: 'error_content', args: { error: null }}")
      p(v-t="message")
    nuxt-link(to="/")
  .section
    .container
      .columns
        .column.is-half-desktop
          p.heading(style="padding-top: 24px; margin-bottom: 12px;" v-t="'connect_title'")
          #discord.box.is-gradient
            img(:src="require('@/assets/images/discord.png')" style="width: 110px;")
            p(style="margin-top: 0.5rem; margin-bottom: 0.5rem;" v-t="'connect_discord_content'")
            b-button(expanded href="https://discord.gg/cytoid" tag="a" icon-left="sign-in" type="is-transparent")
              span(v-t="'connect_discord_btn'")
    .container
      p.heading(style="padding-top: 24px; margin-bottom: 12px;" v-t="'donate_title'")
      .columns
        .column.is-half-desktop
          #patron.box.is-gradient
            img(:src="require('@/assets/images/patreon.png')" style="width: 150px;")
            p(style="margin-top: 0.5rem; margin-bottom: 0.5rem;"  v-t="'connect_patreon_content'")
            b-button(expanded href="https://www.patreon.com/tigerhix" tag="a" icon-left="heart" type="is-transparent")
              span Become a patron!
        .column.is-half-desktop
          #afdian.box.is-gradient
            img(:src="require('@/assets/images/afdian.png')" style="width: 110px;")
            p(style="margin-top: 0.5rem; margin-bottom: 0.5rem;" )
              | Cytoid 是 100% 免费并且开源的音乐游戏。不过，服务器的运营费用十分高昂。喜欢 Cytoid 的话，不妨考虑...
            b-button(expanded href="https://afdian.net/@tigerhix" tag="a" icon-left="mug-hot" type="is-transparent")
              span 请作者喝咖啡
</template>

<script>
export default {
  name: 'ErrorLayout',
  layout: 'default',
  components: {
  },
  props: {
    error: {
      type: Object,
      required: true,
    }
  },
  computed: {
    message () {
      if (!this.error) {
        return 'Unknown error'
      }
      return this.error.message
    }
  },
  i18n: {
    key: 'error_page'
  }
}
</script>

<style scoped lang="scss">
.logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70vh;

  img {
    max-width: 400px;
  }
  .buttons-container {
    @include mobile {
      display: flex;
      flex-direction: column;
      margin-top: 24px;
      .button {
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
      }
    }
    @include tablet {
      margin-left: 0.5rem;
      .button {
        margin-left: 0.5rem;
        margin-right: 0.5rem;
      }
    }
  }

  @include tablet {
    align-items: start;
  }
  .slogan {
    text-shadow: 0 2px 2px rgba(0, 0, 0, 0.4);
    font-size: $size-medium;
    color: white;
    @include tablet {
      margin-left: 1rem;
      margin-bottom: 1rem;
    }
  }
}
</style>

<style lang="scss" scoped>

.box {
  &#discord {
    --box-background-gradient: linear-gradient(to right bottom, #7289DA, #7289DA);
  }
  &#patron {
    --box-background-gradient: linear-gradient(to right bottom, #F96854, #F96854);
  }
  &#afdian {
    --box-background-gradient: linear-gradient(to right bottom, hsla(260, 71%, 66%, 1), hsla(260, 71%, 66%, 1));
  }
}
</style>

<style lang="scss" scoped>
.sorry-img {
  float: right;
  height: 0;
  img {
    height: 10rem;
  }
}
.error-texts {
  align-items: start;
  padding-left: 1rem;
  h1 {
    font-size: xxx-large;
  }
  p {
    font-size: 1.2rem;
  }
  .multi-line {
    display: block;
  }
  .single-line {
    display: none;
  }
}
a.button {
  margin: 1rem 0;
}
@media screen and (min-width: $tablet) {
  .sorry-img {
    float: right;
    padding-right: 1rem;
    height: 0;
    img {
      height: 10rem;
    }
  }
  .error-texts {
    .multi-line {
      display: none;
    }
    .single-line {
      display: block;
    }
  }
}
@media screen and (min-width: $desktop) {
  .sorry-img {
    float: right;
    padding-right: 1rem;
    height: 0;
    img {
      height: 30rem;
    }
  }
}
</style>
