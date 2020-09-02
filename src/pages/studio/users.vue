<template lang="pug">
.section
  .heading Lookup a user
  .box
    b-field(label="By UUID" horizontal)
      b-input(v-model="id")
      p.control: button.button.is-warning(@click="lookup('uuid')") Lookup
    b-field(label="By ID" horizontal)
      b-input(v-model="uid")
      p.control: button.button.is-warning(@click="lookup('uid')") Lookup

  template(v-if="user")
    .heading {{user.name||user.uid}}'s Profile
    .box
      .media
        .media-left
          avatar(:source="user.avatar.large" fixed :size="128")
        .media-content
          .content
            p ID: {{user.id}}
            p UID: {{user.uid}}
            p Name: {{user.name}}
            p(v-if="user.email") Email: {{user.email.address}} ({{user.email.verified ? 'Verified' : 'Unverified'}})
            ul(v-if="user.emails")
              li(v-for="email in user.emails") {{email.address}} ({{email.verified ? 'Verified' : 'Unverified'}})
            p(v-if="user.registrationDate") Registration Date: {{$dateFormatCalendar(user.registrationDate)}}
            p Role: {{user.role}}
      template(v-if="$store.state.user && $store.state.user.role === 'admin'")
        hr
        b-field(horizontal label="Disable User" style="margin-top: 1rem;")
          b-switch(:value="user.active" @input="setActive") Active
        b-field(horizontal label="Grant Badge")
          b-input(v-model="badgeId")
          p.control: button.button.is-warning(@click="grantUserBadge") Grant
        b-field(horizontal label="Cheater Mode")
          b-button(type="is-danger" @click="banUser") Ban
</template>

<script>
import gql from 'graphql-tag'
export default {
  name: 'StudioUsers',
  data () {
    return {
      id: null,
      uid: null,
      user: null,
      badgeId: null,
    }
  },
  methods: {
    lookup (type) {
      this.$apollo.query({
        query: gql`query StudioLookupUser($uid: String, $id: ID) {
          user(id: $id, uid: $uid) {
            id
            uid
            name
            email {
             address
             verified
            }
            emails {
              address
              verified
            }
            registrationDate
            role
            avatar {
              large
            }
            active
          }
        }`,
        variables: type === 'uuid' ? { id: this.id } : { uid: this.uid }
      })
        .then(({ data }) => {
          if (!data.user) {
            this.$buefy.snackbar.open({
              message: "This user wasn't found",
              type: 'is-warning',
              position: 'is-top',
            })
          } else {
            this.user = data.user
          }
        })
    },
    setActive (active) {
      if (!this.user) {
        return
      }
      this.$apollo.mutate({
        mutation: gql`mutation StudioSetUserActive($id: ID!, $active: Boolean!) {
          setUserActive(id: $id, active: $active)
        }`,
        variables: {
          id: this.user.id,
          active,
        }
      })
    },
    grantUserBadge () {
      this.$apollo.mutate({
        mutation: gql`mutation StudioGrantUserBadge($id: ID!, $badge: String!) {
          grantUserBadge(id: $id, badge: $badge)
        }`,
        variables: {
          id: this.user.id,
          badge: this.badgeId,
        }
      })
        .catch(err => this.handleErrorToast(err))
    },
    banUser () {
      this.$buefy.dialog.confirm({
        title: `Nuke ${this.user.name || this.user.uid}'s account?`,
        message: 'This is going to delete all his playing records, make the user inactive, and give the user a cheater badge.',
        onConfirm: () => {
          this.$buefy.dialog.prompt({
            message: 'Why should we ban this user?',
            inputAttrs: {
              placeholder: 'e.g. Cheating',
            },
            trapFocus: true,
            onConfirm: (reason) => {
              this.$apollo.mutate({
                mutation: gql`mutation StudioBanUser($id: ID!, $reason: String!) {
                  banUser(id: $id, reason: $reason)
                }`,
                variables: {
                  id: this.user.id,
                  reason
                }
              })
            }
          })
        }
      })
    }
  }
}
</script>
