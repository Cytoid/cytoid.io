import ContentCard from '../ContentCard'
export default {
  name: 'CollectionSimpleCard',
  functional: true,
  params: {
    value: {
      type: Object,
      required: true,
    }
  },
  render(h, context) {
    const owner = context.props.value.owner
    const slots = {
      top: () => <span class="tag is-white is-light">{context.parent.$t('collection_card_levels_count_tag', { count: context.props.value.levelCount }) }</span>,
      bottom: () => (<div>
        <h2 class="content-subtitle">{context.props.value.slogan}</h2>
        <h1 class="content-title">{context.props.value.title}</h1>
        {owner &&
          <nuxt-link
            class="link"
            to={{ name: 'profile-id', params: { id: context.props.value.owner.uid || context.props.value.owner.id } }}>
            <avatar size={24} fixed={true} src={context.props.value.owner.avatar?.small}/>
            <span>{context.props.value.owner.name || context.props.value.owner.uid}</span>
          </nuxt-link>
        }
      </div>)
    }
    return (
      <ContentCard
        image={context.props.value.cover?.thumbnail}
        to={{ name: 'collections-id', params: { id: context.props.value.uid } }}
        scopedSlots={slots}>
      </ContentCard>
    )
  }
}
