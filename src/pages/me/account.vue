<template lang="pug">
.section
  a-list(
    bordered
    :dataSource="emails"
  ).email-list
    a-list-item(slot="renderItem" slot-scope="item, index" style="align-items: center;")
      | {{item.address}}
      .list-buttons
        a-button(v-if="!item.verified")
          font-awesome-icon(icon="envelope").icon
          | Verify
        a-button(v-if="!item.primary && item.verified")
          font-awesome-icon(icon="chevron-up").icon
          | Make Primary
        a-button(type="danger")
          font-awesome-icon(icon="trash").icon
          | Delete
</template>

<script>
export default {
  data: () => ({
    emails: [
      { address: 'asdfasdf', verified: false, primary: true },
      { address: ';lj;lkj;lkj', verified: true, primary: false },
    ],
  }),
  asyncData(context) {
    const { $axios } = context
    const $auth = context.app.$auth
    $axios.get(`/users/${$auth.user.id}/emails`)
      .then((response) => {
        console.log(response.data)
      })
  }
}
</script>

<style lang="less">
.email-list .ant-list-item-content {
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
</style>
