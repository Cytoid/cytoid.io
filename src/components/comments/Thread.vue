<template lang="pug">
  div
    template(v-if="loading")
      comment-skeleton(v-for="i in 3" :key="i")
    template(v-else)
      comment(v-for="comment in comments" :key="comment.id" :value="comment" :category="category" :thread="thread")
    new-comment(:thread="thread" :category="category" @created="comments.push($event)")
</template>

<script>
import Comment from './Comment'
import NewComment from './NewComment'
import CommentSkeleton from './CommentSkeleton'

export default {
  name: 'Thread',
  components: {
    Comment,
    NewComment,
    CommentSkeleton,
  },
  props: {
    category: {
      type: String,
      required: true,
    },
    thread: {
      type: String,
      required: true,
    }
  },
  data() {
    return {
      loading: true,
      comments: []
    }
  },
  mounted() {
    this.$axios.get(`threads/${this.category}/${this.thread}`)
      .then((res) => {
        this.comments = res.data
      })
      .catch(err => this.handleErrorToast(err))
      .finally(() => {
        this.loading = false
      })
  },
}
</script>
