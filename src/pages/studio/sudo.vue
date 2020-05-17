<template lang="pug">
  .section.has-text-centered
    font-awesome-icon(icon="exchange" size="6x" style="margin-bottom: 3rem; margin-top: 3rem;")
    .title Do you want to be a superuser?
    button.button.is-danger.is-large(@click="sudo") Be a superuser
</template>

<script>
export default {
  name: 'Sudo',
  methods: {
    sudo() {
      this.$buefy.dialog.confirm({
        message: 'Do you want to be a superuser?',
        type: 'is-danger',
        onConfirm: () => {
          this.$axios.post('/session/sudo')
            .then((res) => {
              this.$store.commit('setUser', res.data)
              this.$buefy.toast.open({
                message: "You're a superuser now!",
                type: 'is-warning'
              })
            })
            .catch(err => this.handleErrorToast(err))
        }
      })
    }
  }
}
</script>
