function routeOption (route, key) {
  for (const m of route.matched) {
    if (process.browser) {
      for (const component of Object.values(m.components)) {
        if (component.options && (key in component.options)) {
          return component.options[key]
        }
      }
    } else {
      for (const component of Object.values(m.components)) {
        for (const ctor of Object.values(component._Ctor)) {
          if (ctor.options && (key in ctor.options)) {
            return ctor.options[key]
          }
        }
      }
    }
  }
}

export default function ({ route, store }) {
  let background = routeOption(route, 'background')
  if (background === null) {
    return
  }
  if (background instanceof String || typeof background === 'string') {
    background = { source: background }
  } else if (!background) {
    background = null
  }
  store.commit('setBackground', background)
}
