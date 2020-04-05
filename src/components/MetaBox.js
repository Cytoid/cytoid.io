export default {
  functional: true,
  render(h, context) {
    const metadata = context.props.metadata
    return (<div class="box">
      {
        ['artist', 'illustrator', 'charter', 'storyboarder']
          .map((key) => {
            const data = metadata[key]
            return data && <div class="box-section">
              <p class="card-heading">{key}</p>
              <p class="card-em-text">{data.name}</p>
              {
                data.localized_name && <p class="card-em-text">{data.localized_name}</p>
              }
              {
                data.url && <a class="button" href={data.url}>Source</a>
              }
            </div>
          })
      }
    </div>)
  },
  props: {
    metadata: {
      type: Object,
      required: true,
    }
  }
}
