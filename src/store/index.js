export const state = () => ({
  background: {
    source: null,
    overlayOpacity: 0.5,
    parallaxSpeed: 0.2,
  },
})
export const mutations = {
  setBackground(state, background) {
    state.background.source = background?.source
    state.background.overlayOpacity = background?.overlayOpacity || 0.5
    state.background.parallaxSpeed = background?.parallaxSpeed || 0.2
  }
}
export const actions = {
}
