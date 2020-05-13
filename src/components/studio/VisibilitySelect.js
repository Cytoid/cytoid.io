export default {
  name: 'VisibilitySelect',
  functional: true,
  render(h, ctx) {
    const data = {
      PUBLIC: { title: 'visibility_status_public', icon: 'globe' },
      PRIVATE: { title: 'visibility_status_private', icon: 'lock' },
      UNLISTED: { title: 'visibility_status_unlisted', icon: 'eye-slash' },
    }
    const value = ctx.props.value || 'PUBLIC'
    return <b-dropdown vOn:change={ctx.listeners.change}>
      <button class="button" slot="trigger" type="button">
        <font-awesome-icon icon={data[value].icon} style={{ 'margin-right': '0.5rem' }} />
        {ctx.parent.$t(data[value].title)}
        <font-awesome-icon icon="caret-down" style={{ 'margin-left': '0.5rem' }} />
      </button>
      {['PUBLIC', 'UNLISTED', 'PRIVATE'].map((state) => {
        const item = data[state]
        return <b-dropdown-item value={state}>
          <font-awesome-icon fixed-width icon={item.icon} style={{ 'margin-right': '0.5rem' }} />
          {ctx.parent.$t(item.title)}
        </b-dropdown-item>
      })}
    </b-dropdown>
  },
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  i18n: {
    key: 'studio'
  }
}
