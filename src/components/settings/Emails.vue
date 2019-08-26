<template lang="pug">
div
  div(class="card-pre-header")
    p Emails
  a-card
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
            | Verify
          a-button(v-if="!item.primary && item.verified" @click="makePrimary(item)")
            font-awesome-icon(icon="chevron-up").icon
            | Make Primary
          a-button(type="danger" @click="removeEmail(item.address, index)")
            font-awesome-icon(icon="trash").icon
            | Delete
    a-form(layout="inline" @submit.prevent="addEmail" :form="newEmailForm" hideRequiredMark)
      a-form-item(label="Add email address")
        a-input(
          v-decorator="['email', { rules: [{ required: true, message: 'An email address is required.' },{ type: 'email', message: 'This is not a valid email' }]}]"
          html-type="envelope"
          placeholder="example@cytoid.io"
        )
          font-awesome-icon(slot="prefix" icon="envelope")
      a-form-item
        a-button(html-type="submit" :disabled="loading")
          font-awesome-icon(icon="plus" style="margin-right: 0.5rem;")
          | Add
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      newEmailForm: this.$form.createForm(this),
      emails: [],
    }
  },
  mounted() {
    this.$axios.get(`/users/${this.$store.state.user.id}/emails`)
      .then((response) => {
        this.emails = response.data
      })
  },
  methods: {
    addEmail() {
      this.newEmailForm.validateFields((err, values) => {
        if (err) {
          return
        }
        this.loading = true
        this.$axios.post(`/users/${this.$store.state.user.id}/emails`, values)
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
      this.$axios.delete(`/users/${this.$store.state.user.id}/emails/${email}`)
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
      this.$axios.post(`/users/${this.$store.state.user.id}/emails/${email}/verify`)
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
      this.$axios.patch(`/users/${this.$store.state.user.id}/emails/${item.address}`, { primary: true })
        .then(() => {
          this.emails.forEach((email) => {
            email.primary = false
          })
          item.primary = true
        })
        .catch((error) => {
          this.handleErrorToast(error)
        })
        .then(() => {
          this.loading = false
        })
    }
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
