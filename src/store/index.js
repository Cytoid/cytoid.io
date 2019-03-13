export const state = () => ({
  user: null
})
export const mutations = {
  setUser(state, user) {
    state.user = user
  },
}
export const actions = {
  nuxtServerInit({ commit }, { req }) {
    if (!req) {
      return
    }
    const session = req.ctx.session
    if (session && session.passport && session.passport.user) {
      commit('setUser', req.ctx.session.passport.user)
    }
  },
  logout({ commit }) {
    return this.$axios.delete('/session')
      .then(() => {
        commit('setUser', null)
      })
  },
}
