<template lang="pug">
.container
  .section: .sorry-img
    img(:src="require('@/assets/images/sayakacry.png')")
  .section: .container.error-texts
    h1(v-t="'error_page_title'")
    .single-line
      p(v-t="{path: 'error_page_subtitle', args: { error: message }}")
    .multi-line
      p(v-t="{path: 'error_page_subtitle', args: { error: null }}")
      p(v-t="message")
</template>

<script>
export default {
  name: 'ErrorLayout',
  layout: 'default',
  props: {
    error: {
      type: Object,
      required: true,
    }
  },
  computed: {
    message () {
      if (!this.error || !this.error.message) {
        return this.$t('Unknown Error')
      }
      return this.error.message
    }
  },
  head () {
    return {
      htmlAttrs: {
        lang: this.$store.state.locale,
      }
    }
  },
}
</script>



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
@media screen and (min-width: 769px) {
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
@media screen and (min-width: 1024px) {
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
