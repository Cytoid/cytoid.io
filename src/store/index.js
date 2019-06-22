export const state = () => ({
  background: {
    source: null,
    overlayOpacity: 0.5,
    parallaxSpeed: 0.2,
  },
  user: false,
})
export const mutations = {
  setBackground(state, background) {
    state.background.source = background?.source
    state.background.overlayOpacity = background?.overlayOpacity || 0.5
    state.background.parallaxSpeed = background?.parallaxSpeed || 0.2
  },
  setUser(state, user) {
    state.user = user
  },
}
export const actions = {
  nuxtServerInit({ dispatch, commit }, { $axios, error, req }) {
    if (req) {
      // Read cookies success
      const user = req.ctx.session?.passport?.user
      commit('setUser', user)
    }
  },
  logout({ commit }) {
    commit('setUser', null)
    return this.$axios.delete('/session')
  }
}
