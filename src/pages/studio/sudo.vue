<template lang="pug">
div
  .section.has-text-centered
    font-awesome-icon(icon="exchange" size="6x" style="margin-bottom: 3rem; margin-top: 3rem;")
    .title Do you want to be a superuser?
    button.button.is-danger.is-large(@click="sudo") Be a superuser
  .section(v-if="$store.state.user && $store.state.user.role === 'admin'"): .container
    .heading Worker Command
    .box
      b-field(label="command")
        b-input(v-model="workerCommand.command")
      b-field(label="argument")
        b-input(v-model="workerCommand.argument")
      .buttons
        b-button(@click="sendWorkerCommand()") Emit
        b-button(@click="sendWorkerCommand('level')") Emit Level
        b-button(@click="sendWorkerCommand('user')") Emit User
        b-button(@click="sendWorkerCommand('record')") Emit Record
</template>

<script>
export default {
  name: 'Sudo',
  data() {
    return {
      workerCommand: {
        command: '',
        argument: '',
      }
    }
  },
  methods: {
    sendWorkerCommand(type) {
      this.$axios.post(type ? '/workers/' + type : '/workers', this.workerCommand)
        .then(() => {
          this.$buefy.toast.open({
            message: 'Command Sent',
            type: 'is-warning',
          })
        })
    },
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
