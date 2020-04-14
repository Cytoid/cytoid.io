import DifficultyBadge from '@/components/level/DifficultyBadge'
import PlayButton from '@/components/level/PlayButton'
import ContentCard from '../ContentCard'

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
      top: () => (
        <div>
          {
            value.charts && value.charts.map(chart =>
              <DifficultyBadge
                class="ele3 content-card-control"
                style={{ 'margin-right': '4px' }}
                key={chart.id}
                value={chart}
                ball={true}
                name={false} />
            )
          }
        </div>),
      bottom: () => (<div>
        {artist && <h2 class="subtitle">{artist}</h2>}
        {value.title && <h1 class="title">{value.title}</h1>}
        {titleLocalized && <p class="title">{titleLocalized}</p>}
        {owner &&
          <nuxt-link
            class="link"
            to={{ name: 'profile-id', params: { id: value.owner.uid || value.owner.id } }}>
            { value.owner?.avatar?.small && <avatar size={24} fixed={true} source={value.owner?.avatar?.small}/> }
            <span>{value.owner.name || value.owner.uid}</span>
          </nuxt-link>
        }
      </div>),
      action: () => value.musicPreview &&
        <PlayButton class="content-card-control" src={value.musicPreview}/>
    }
    return (
      <ContentCard
        image={value.cover?.thumbnail ||
          value.bundle?.backgroundImage?.thumbnail}
        to={{ name: 'levels-id', params: { id: value.uid } }}
        scopedSlots={slots}>
      </ContentCard>
    )
  },
}
