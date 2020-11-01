<script>
export default {
  name: 'FontAwesomeDyn',
  functional: true,
  props: {
    icon: {
      type: Object,
      required: true,
    },
  },
  render(h, context) {
    const svg = context.props.icon.svg
    delete context.props.icon.svg
    if (!context.data.domProps) {
      context.data.domProps = {}
    }
    context.data.domProps.innerHTML = svg
    context.data.class.push('fa-dyn')
    return h('div', context.data)
  }
}

export function loadFontAwesomeSvg(pack, icon) {
  const iconPackPathName = {
    fas: 'solid',
    fad: 'duotone',
    fab: 'brands',
    fal: 'light',
    far: 'regular',
  }[pack]
  if (process.client) {
    const iconURL = `https://artifacts.cytoid.io/fontawesome/svgs/${iconPackPathName}/${icon}.svg`
    return fetch(iconURL)
      .then(res => res.text())
      .catch((err) => {
        console.error(err)
        return null
      })
  } else {
    return import(
      /* webpackInclude: /\.svg$/ */
      /* webpackChunkName: "fontawesome-dyn" */
      /* webpackMode: "lazy-once" */
      /* webpackPrefetch: true */
      /* webpackPreload: true */
      `@fortawesome/fontawesome-pro/svgs/${iconPackPathName}/${icon}.svg`
    )
      .then(a => a.default)
  }
}
</script>

<style lang="scss">
  .fa-dyn {
    color: $theme7;
    fill: currentColor;
    .fa-secondary, .fa-primary {
      fill: currentColor;
    }
    &.is-orange {
      .fa-secondary {
        fill: $orange;
        opacity: 1;
      }
    }
    &.is-yellow {
      .fa-secondary {
        fill: $yellow;
        opacity: 1;
      }
    }
    &.is-green {
      .fa-secondary {
        fill: $green;
        opacity: 1;
      }
    }
    &.is-turquoise {
      .fa-secondary {
        fill: $turquoise;
        opacity: 1;
      }
    }
    &.is-cyan {
      .fa-secondary {
        fill: $cyan;
        opacity: 1;
      }
    }
    &.is-blue {
      .fa-secondary {
        fill: $blue;
        opacity: 1;
      }
    }
    &.is-purple {
      .fa-secondary {
        fill: $purple;
        opacity: 1;
      }
    }
    &.is-red {
      .fa-secondary {
        fill: $red;
        opacity: 1;
      }
    }
  }
</style>
