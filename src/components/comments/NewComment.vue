<template lang="pug">
  article.media(v-if="$store.state.user")
    figure.media-left
      avatar(fixed :size="64" :source="$store.getters.avatarURL()")
    .media-content
      b-field
        b-input(type="textarea" v-model="content")
      b-button.is-primary.is-pulled-right(@click="postComment" :loading="loading" :disabled="!(content && content.length > 5)") {{$t('comment_post')}}
      .is-clearfix
  article.media(v-else)
    figure.media-left
      avatar(fixed :size="64")
    .media-content
      .box.has-text-centered.has-background-grey-darker
        nuxt-link.button(:to="{ name: 'session-login'}" v-t="'login_btn'")
</template>

<script>
export default {
  name: 'NewComment',
  props: {
    category: {
      type: String,
      required: true,
    },
    thread: {
      type: String,
      required: true,
    },
    parent: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      loading: false,
      content: '',
    }
  },
  methods: {
    findCaptchaElement(element) {
      if (!element) {
        return element
      }
      if (element.$refs.captcha) {
        return element.$refs.captcha
      }
      return this.findCaptchaElement(element.$parent)
    },
    postComment() {
      this.loading = true
      const captcha = this.findCaptchaElement(this.$parent)
      console.log(captcha)
      if (!captcha) {
        console.error('comment requires captcha element placed in DOM tree')
      }
      captcha.execute()
        .then((code) => {
          if (this.parent) {
            return this.$axios.post('/comments/' + this.parent, {
              captcha: code,
              content: this.content,
              category: this.category,
              key: this.thread,
            })
          } else {
            return this.$axios.post('/comments', {
              captcha: code,
              category: this.category,
              key: this.thread,
              content: this.content,
            })
          }
        })
        .then((res) => {
          const comment = res.data
          comment.owner = {
            id: this.$store.state.user.id,
            uid: this.$store.state.user.uid,
            name: this.$store.state.user.name,
            avatarURL: this.$store.getters.avatarURL(),
          }
          this.$emit('created', res.data)
          this.$buefy.toast.open({
            message: 'Comment Added',
            type: 'is-success',
          })
          this.content = ''
        })
        .catch(err => this.handleErrorToast(err))
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
