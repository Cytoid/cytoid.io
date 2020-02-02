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
      top: () => <span class="tag is-white is-light">{context.props.value.levelCount} levels</span>,
      bottom: () => (<div class="info">
        <h2 class="subtitle">{context.props.value.slogan}</h2>
        <h1 class="title">{context.props.value.title}</h1>
        {owner &&
          <nuxt-link
            class="link"
            to={{ name: 'profile-id', params: { id: context.props.value.owner.uid || context.props.value.owner.id } }}>
            <avatar size={24} fixed={true} src={context.props.value.owner.avatarURL}/>
            <span>{context.props.value.owner.name || context.props.value.owner.uid}</span>
          </nuxt-link>
        }
      </div>)
    }
    return (
      <ContentCard
        image={context.parent.$img(context.props.value.coverPath, { height: 500 })}
        to={{ name: 'collections-id', params: { id: context.props.value.uid } }}
        scopedSlots={slots}>
      </ContentCard>
    )
  }
}
/*
ContentCard(
:image=""
:to=""
)
template(v-slot:top)
span.tag.is-white.is-light {{ props.value.levelCount }} levels
template(v-slot:bottom)
.subtitle(v-text="props.value.slogan")
  .title(v-text="props.value.title")
nuxt-link(
  v-if="props.value.owner"
  :to=""
)
avatar(:size="24" fixed :src="props.value.owner.avatarURL" style="margin-right: 8px;")
span(v-text="props.value.owner.name || props.value.owner.uid")
*/
