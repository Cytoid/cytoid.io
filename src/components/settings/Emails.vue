<template lang="pug">
div
  div(class="card-pre-header")
    p(v-t="'email_title'")
  .box
    a-list(
      bordered
      :dataSource="emails"
      :loading="loading"
    ).email-list
      a-list-item(slot="renderItem" slot-scope="item, index" style="align-items: center;")
        | {{item.address}}
        .list-buttons
          a-button(v-if="!item.verified" @click="verify(item.address)")
            font-awesome-icon(icon="envelope").icon
            span(v-t="'email_verify'")
          a-button(v-if="!item.primary && item.verified" @click="makePrimary(item)")
            font-awesome-icon(icon="chevron-up").icon
            span(v-t="'email_make_primary'")
          a-button(type="danger" @click="removeEmail(item.address, index)")
            font-awesome-icon(icon="trash").icon
            span(v-t="'email_delete'")
    a-form(layout="inline" @submit.prevent="addEmail" :form="newEmailForm" hideRequiredMark)
      a-form-item(:label="$t('email_add')")
        a-input(
          v-decorator="['email', { rules: [{ required: true, message: $t('email_required') },{ type: 'email', message: $t('email_valid') }]}]"
          html-type="envelope"
          placeholder="example@cytoid.io"
        )
          font-awesome-icon(slot="prefix" icon="envelope")
      a-form-item
        a-button(html-type="submit" :disabled="loading")
          font-awesome-icon(icon="plus" style="margin-right: 0.5rem;")
          span(v-t="'email_add_btn'")
</template>

<script>
import gql from 'graphql-tag'
export default {
  data() {
    return {
      loading: false,
      newEmailForm: this.$form.createForm(this),
      emails: [],
    }
  },
  mounted() {
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
    addEmail() {
      this.newEmailForm.validateFields((err, values) => {
        if (err) {
          return
        }
        this.loading = true
        this.$apollo.mutate({
          mutation: gql`mutation AddEmail($email: String!) {
          addEmail(email: $email)
        }`,
          variables: { email: values.email }
        })
          .then(() => {
            this.emails.push({ address: values.email, primary: false, verified: false })
          })
          .catch((error) => {
            this.handleErrorToast(error)
          })
          .then(() => {
            this.loading = false
          })
      })
    },
    removeEmail(email, index) {
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
    verify(email) {
      this.loading = true
      this.$apollo.mutate({
        mutation: gql`mutation SendConfirmationEmail($email: String!) {
          sendVerificationEmail(email: $email)
        }`,
        variables: { email }
      })
        .then(() => {
          this.$message.info('Confirmation email sent')
        })
        .catch((error) => {
          this.handleErrorToast(error)
        })
        .then(() => {
          this.loading = false
        })
    },
    makePrimary(item) {
      this.loading = true
      this.$apollo.mutate({
        mutation: gql`mutation MakeEmailPrimary($email: String!) {
          makeEmailPrimary(email: $email)
        }`,
        variables: { email: item.address }
      })
        .then(() => {
          this.$message.info(item.address + ' is now your primary email address!')
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

<style lang="less">
.email-list {
  margin-bottom: 36px;
  .ant-list-item-content {
    align-items: center;
    .list-buttons {
      margin-left: auto;
      button{
        &:not(:last-child) {
          margin-right: 0.5rem;
        }
        .icon {
          margin-right: 0.5rem;
        }
      }
    }
  }
}
</style>
