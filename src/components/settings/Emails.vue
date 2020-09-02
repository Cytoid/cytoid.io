<template lang="pug">
.section
  .heading(v-t="'email_title'")
  .box(style="position: relative; overflow: hidden;")
    .media(v-for="(email, index) in emails")
      .media-content {{ email.address }}
      .media-right.buttons
        b-button(v-if="!email.verified" @click="verify(email.address)" icon-left="envelope")
          span(v-t="'email_verify'")
        b-button(v-if="!email.primary && email.verified" @click="makePrimary(email)" icon-left="chevron-up")
          span(v-t="'email_make_primary'")
        b-button(type="is-danger" @click="removeEmail(email.address, index)" icon-left="trash")
          span(v-t="'email_delete'")
    ValidationObserver(v-slot="{ invalid, handleSubmit }" tag="div" ref="emailObserver").media
      .media-content
        ValidationProvider(rules="email|required" v-slot="{ errors, valid }" name="Email" vid="email")
          b-field(style="max-width: 400px;" :type="{ 'is-danger': errors[0], 'is-success': valid }" :message="errors")
            b-input(type="email" icon="envelope" v-model="newEmail")
      .media-right
        b-button.is-success(:disabled="invalid" @click="handleSubmit(addEmail)" icon-left="plus")
          span(v-t="'email_add_btn'")
    b-loading(:active="loading" :is-full-page="false")
</template>

<script>
import gql from 'graphql-tag'
export default {
  data () {
    return {
      loading: false,
      newEmail: '',
      emails: [],
    }
  },
  mounted () {
    this.$apollo.query({
      query: gql`query GetUserEmails {
        my {
          emails {
            address
            verified
          }
          user {
            id
            email {
             address
            }
          }
        }
      }`
    })
      .then(({ data }) => {
        for (const email of data.my.emails) {
          if (email.address === data.my.user.email?.address) {
            email.primary = true
          }
        }
        this.emails = data.my.emails
      })
  },
  methods: {
    addEmail () {
      this.loading = true
      this.$apollo.mutate({
        mutation: gql`mutation AddEmail($email: String!) {
        addEmail(email: $email)
      }`,
        variables: { email: this.newEmail }
      })
        .then(() => {
          this.emails.push({ address: this.newEmail, primary: false, verified: false })
          this.newEmail = null
          requestAnimationFrame(() => this.$refs.emailObserver.reset())
        })
        .catch((error) => {
          const errors = {
            email: null,
          }
          if (error.graphQLErrors?.length > 0) {
            errors.email = []
            for (const err of error.graphQLErrors) {
              if (err.message) { errors.email.push(err.message) }
            }
          } else {
            errors.email = error.message
          }
          this.$refs.emailObserver.setErrors(errors)
        })
        .then(() => {
          this.loading = false
        })
    },
    removeEmail (email, index) {
      this.loading = true
      this.$apollo.mutate({
        mutation: gql`mutation DeleteEmail($email: String!) {
          deleteEmail(email: $email)
        }`,
        variables: { email }
      })
        .then(() => {
          this.emails.splice(index, 1)
        })
        .catch((error) => {
          this.handleErrorToast(error)
        })
        .then(() => {
          this.loading = false
        })
    },
    verify (email) {
      this.loading = true
      this.$apollo.mutate({
        mutation: gql`mutation SendConfirmationEmail($email: String!) {
          sendVerificationEmail(email: $email)
        }`,
        variables: { email }
      })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Confirmation email sent',
            type: 'is-success'
          })
        })
        .catch((error) => {
          this.handleErrorToast(error)
        })
        .then(() => {
          this.loading = false
        })
    },
    makePrimary (item) {
      this.loading = true
      this.$apollo.mutate({
        mutation: gql`mutation MakeEmailPrimary($email: String!) {
          makeEmailPrimary(email: $email)
        }`,
        variables: { email: item.address }
      })
        .then(() => {
          this.$buefy.toast.open({
            message: item.address + ' is now your primary email address!',
            type: 'is-success',
          })
          for (const email of this.emails) {
            email.primary = false
          }
          item.primary = true
        })
        .catch((error) => {
          this.handleErrorToast(error)
        })
        .then(() => {
          this.loading = false
        })
    }
  },
  i18n: {
    key: 'settings'
  }
}
</script>
