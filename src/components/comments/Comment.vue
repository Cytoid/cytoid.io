<template lang="pug">
  article.media.comment
    figure.media-left
      nuxt-link(v-if="value.owner" :to="{ name: 'profile-id', params: { id: value.owner.uid } }")
        avatar(:source="value.owner.avatarURL || (value.owner.avatar && value.owner.avatar.small)" fixed :size="32")
      avatar(v-else fixed :size="32")
    .media-content
      .content
        strong(v-if="value.owner" v-text="value.owner.name || value.owner.uid")
        strong(v-if="value.metadata && value.metadata.disqusUser") Disqus User {{value.metadata.disqusUser.name}}
        small.has-text-light.date(v-text="$dateFormatCalendar(value.date)")
        div(v-text="value.content")
      .level.is-mobile.comment-action-buttons
        .level-left
          a.level-item(@click="addReply" v-if="$store.state.user")
            font-awesome-icon.icon(icon="reply")
            | Reply
          a.level-item(v-if="value.count > 0 && !expanded" @click="expand")
            font-awesome-icon.icon(icon="chevron-down")
            | See {{value.count}} replies
          a.level-item(v-if="value.count > 0 && expanded" @click="expanded=false")
            font-awesome-icon.icon(icon="chevron-up")
            | Hide {{value.count}} replies
      new-comment(v-if="reply" :parent="value.id" :category="category" :thread="thread" @created="created")
      template(v-if="expanded")
        template(v-if="!loaded")
          comment-skeleton(v-for="i in value.count" :key="i")
        template(v-else)
          comment(
            v-for="comment in replies"
            :key="comment.id"
            :value="comment"
            :category="category"
            :thread="thread")
</template>

<script>
import Vue from 'vue'
import CommentSkeleton from './CommentSkeleton'
import NewComment from './NewComment'
const EventBus = new Vue()
export default {
  name: 'Comment',
  components: {
    CommentSkeleton,
    NewComment,
  },
  props: {
    value: {
      type: Object,
      required: true
    },
    category: {
      type: String,
      required: true,
    },
    thread: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      expanded: false,
      loaded: false,
      replies: [],
      reply: false,
    }
  },
  mounted() {
    EventBus.$on('reply_open', (target) => {
      if (target === this) {
        return
      }
      this.reply = false
    })
  },
  methods: {
    expand() {
      this.expanded = true
      return this.$axios.get('/comments/' + this.value.id)
        .then((res) => {
          this.replies = res.data
          this.loaded = true
        })
        .catch(err => this.handleErrorToast(err))
    },
    addReply() {
      this.reply = !this.reply
      if (this.reply) {
        EventBus.$emit('reply_open', this)
      }
    },
    created(record) {
      this.value.count += 1
      if (this.expanded) {
        this.replies.push(record)
      } else {
        this.expand()
          .then(() => {
            if (!this.replies.find(a => a.id === record.id)) {
              this.replies.push(record)
            }
          })
      }
      this.reply = false
    }
  }
}
</script>

<style lang="scss">
.comment {
  .date {
    margin-left: 0.5rem;
  }
  .comment-action-buttons {
    .icon {
      margin-right: 0.5rem;
    }
  }
}
</style>
