<script>
export default {
  name: 'MetaField',
  functional: true,
  props: {
    label: {
      type: String,
      required: true,
    },
    value: {
      type: Object,
      required: true
    }
  },
  render (h, { props, listeners }) {
    function onChange (str, key) {
      if (listeners.input) {
        listeners.input(str, key)
      }
    }
    return <div class="meta-field-container">
      <div class="heading">{props.label}</div>
      <b-field grouped>
        <b-field label="Name" label-position="on-border" expanded>
          <b-input value={props.value?.name} vOn:input={str => onChange(str, 'name')} />
        </b-field>
        <b-field label="Localized name" label-position="on-border" expanded>
          {/* eslint-disable-next-line camelcase */}
          <b-input value={props.value?.localized_name} vOn:input={str => onChange(str, 'localized_name')} />
        </b-field>
      </b-field>
      <b-field label="Source URL" label-position="on-border" expanded>
        <b-input value={props.value?.url} vOn:input={str => onChange(str, 'url')} />
      </b-field>
    </div>
  },
}
</script>

<style lang="scss">
.meta-field-container {
  background-color: $grey-light;
  border-radius: $radius;
  padding: 1rem;
  .heading {
    margin-bottom: 1rem;
  }
  &:not(:last-child) {
    margin-bottom: 1rem;
  }
}
</style>
