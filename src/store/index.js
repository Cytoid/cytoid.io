export const state = () => ({
  background: {
    source: null,
    overlayOpacity: 0.5,
    parallaxSpeed: 0.2,
  },
  user: false,
  avatar: null,
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
  setAvatar(state, avatarURL) {
    state.avatar = avatarURL
  },
}
export const actions = {
  nuxtServerInit({ dispatch, commit, state }, { $axios, error, req }) {
    if (req) {
      // Read cookies success
      const user = req.ctx.session?.passport?.user
      commit('setUser', user)
    }
  },
  login({ commit }, payload) {
    return this.$axios
      .post('/session', payload, { withCredentials: true })
      .then((response) => {
        const user = response.data.user
        console.log(user)
        commit('setUser', user)
        commit('setAvatar', user.avatarURL)
        return user
      })
  },
  logout({ commit }) {
    commit('setUser', null)
    commit('setAvatar', null)
    return this.$axios.delete('/session')
  }
}
