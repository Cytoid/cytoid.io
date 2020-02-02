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
  render(createElement, context) {
    const post = context.props.value
    const slots = {
      top: () => <span>{ context.parent.$dateFromNow(post.published_date) }</span>,
      bottom: () => (<div>
        {post.title && <h1 class="title">{post.title}</h1>}
        {post.description && <h2 class="subtitle">{post.description}</h2>}
      </div>),
    }
    return (
      <ContentCard
        {...context.data}
        image={post.cover_art.data.full_url}
        to={{ name: 'posts-id', params: { id: post.slug } }}
        scopedSlots={slots}>
      </ContentCard>
    )
  }
}
</script>
