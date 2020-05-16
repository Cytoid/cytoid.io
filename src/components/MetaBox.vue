<script>
export default {
  functional: true,
  props: {
    metadata: {
      type: Object,
      required: true,
    }
  },
  render(h, context) {
    const metadata = context.props.metadata
    return (<div class="box box-metadata">
      {
        ['artist', 'illustrator', 'charter', 'storyboarder', 'cover']
          .map((key) => {
            const data = metadata[key]
            return data && <div class="box-section">
              <p class="box-subtitle">{key}</p>
              <p class="title">{data.name}</p>
              {
                data.localized_name && <p class="title">{data.localized_name}</p>
              }
              {
                data.url && <a class="button" href={data.url}>Source</a>
              }
            </div>
          })
      }
    </div>)
  },
}
</script>

<style>
.box-metadata .title {
  margin-bottom: 0.5rem;
}
</style>
