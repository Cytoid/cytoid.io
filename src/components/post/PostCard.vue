<script>
import ContentCard from '../ContentCard'
export default {
  functional: true,
  props: {
    value: {
      type: Object,
      required: true
    },
  },
  render (createElement, context) {
    const post = context.props.value
    const slots = {
      top: () => <span>{ context.parent.$dateFromNow(post.creationDate) }</span>,
      bottom: () => (<div>
        {post.title && <h1 class="is-size-4">{post.title}</h1>}
        {post.slogan && <h2 class="is-size-6">{post.slogan}</h2>}
      </div>),
    }
    return (
      <ContentCard
        class="post-card"
        {...context.data}
        image={post.cover?.stripe}
        to={{ name: 'posts-id', params: { id: post.uid } }}
        scopedSlots={slots}>
      </ContentCard>
    )
  }
}
</script>

<style lang="scss">
.post-card {
  padding-top: 37.5% !important;
  @media(min-width: 1024px) {
    padding-top: 22.5% !important;
  }
  &:not(:last-child) {
    margin-bottom: 12px;
  }
}
</style>
