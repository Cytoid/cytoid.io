import ContentCard from '../ContentCard'
import DifficultyBadge from '@/components/level/DifficultyBadge'
import PlayButton from '@/components/level/PlayButton'
export default {
  props: {
    value: {
      type: Object,
      required: true
    },
  },
  functional: true,
  render(h, context) {
    const value = context.props.value
    const owner = value.owner
    const artist = value.metadata && value.metadata.artist && value.metadata.artist.name
    const titleLocalized = value.metadata && value.metadata.title_localized
    const slots = {
      top: () => value.charts && value.charts.map(chart => (
        <DifficultyBadge
          class="ele3 control"
          style={{ 'margin-right': '4px' }}
          key={chart.id}
          value={chart}
          ball={true}
          name={false} />
      )),
      bottom: () => (<div class="info">
        {artist && <h2 class="subtitle">{artist}</h2>}
        {value.title && <h1 class="title">{value.title}</h1>}
        {titleLocalized && <p class="title">{titleLocalized}</p>}
        {owner &&
          <nuxt-link
            class="link"
            to={{ name: 'profile-id', params: { id: value.owner.uid || value.owner.id } }}>
            <avatar size={24} fixed={true} src={value.owner.avatarURL}/>
            <span>{value.owner.name || value.owner.uid}</span>
          </nuxt-link>
        }
      </div>),
      action: () => value.bundle &&
        value.bundle.music_preview &&
        <PlayButton class="control" src={value.bundle.music_preview}/>
    }
    return (
      <ContentCard
        image={context.parent.$img(context.props.value.bundle.background, { width: 960, height: 600, mode: 'fill' })}
        to={{ name: 'levels-id', params: { id: context.props.value.uid } }}
        scopedSlots={slots}>
      </ContentCard>
    )
  },
}
