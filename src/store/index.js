import Cookies from 'js-cookie'

export const state = () => ({
  background: {
    source: null,
    overlayOpacity: 0.5,
    parallaxSpeed: 0.2,
  },
  user: false,
  avatar: null,
  header: null,
  locale: null,
  country: null,
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
  setHeader(state, headerURL) {
    state.header = headerURL
  },
  setLocale(state, lang) {
    state.locale = lang
    if (this.app.i18n) {
      this.app.i18n.locale = lang
    }
    Cookies.set('locale', lang, { expires: 3600 * 24 * 14 })
  },
  setCountry(state, country) {
    state.country = country
  }
}
export const actions = {
  nuxtServerInit({ dispatch, commit, state }, { $axios, error, req, app }) {
    if (req) {
      // Read cookies success
      const user = req.ctx.session?.passport?.user
      commit('setUser', user)
      if (user) {
        commit('setAvatar', `${process.env.apiURL}/users/${user.id}/avatar`)
      }
    }

    // i18n
  },
  login({ commit }, payload) {
    return this.$axios
      .post('/session', payload, { withCredentials: true })
      .then((response) => {
        const user = response.data.user
        commit('setUser', user)
        commit('setAvatar', user.avatarURL)
        return user
      })
  },
  logout({ commit }) {
    commit('setUser', null)
    commit('setAvatar', null)
    commit('setHeader', null)
    return this.$axios.delete('/session')
  },
}
