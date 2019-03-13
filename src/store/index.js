export const state = () => ({
  token: null
})
export const mutations = {
  setToken(state, auth) {
    state.token = auth
  },
}
export const actions = {
  nuxtServerInit(a, { req }) {
    console.log(req)
  },
  login({ commit }, token) {
    commit('setToken', token)
    this.$axios.setToken(token, 'Bearer')
    localStorage.setItem('cytoid:token', token)
  },
  logout({ commit }) {
    commit('setToken', null)
    this.$axios.setToken(false)
    localStorage.removeItem('cytoid:token')
  }
}
