<script>
import FontAwesomeDyn from '../FontAwesomeDyn'
export default {
  name: 'BadgeStripe',
  functional: true,
  props: {
    value: {
      type: Object,
      required: true,
    }
  },
  render(h, { props }) {
    const iconPath = props.value.metadata?.fontawesome
    return (<div class="media badge-stripe">
      <div class="media-left">
        {iconPath && <FontAwesomeDyn icon={iconPath} class={[iconPath.class]} pulse={iconPath.pulse} spin={iconPath.spin} />}
      </div>
      <div class="media-content">
        <h4 class="title is-size-4">{props.value.title}</h4>
        <h6 class="subtitle is-size-6">{props.value.description}</h6>
      </div>
    </div>)
  }
}
</script>

<style lang="scss">
.badge-stripe .fa-dyn {
  width: 3rem;
  height: 3rem;
}
</style>
