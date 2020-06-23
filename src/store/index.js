export const state = () => ({
  background: {
    source: null,
    overlayOpacity: 0.5,
    parallaxSpeed: 0.2,
  },
  user: false,
  locale: null,
  country: null,
})
export const mutations = {
  setBackground(state, background) {
    state.background.source = background?.source
    state.background.overlayOpacity = background?.overlayOpacity || 0.5
    state.background.parallaxSpeed = background?.parallaxSpeed || 0.2
    state.background.landing = background?.landing || false
  },
  setUser(state, user) {
    state.user = user
  },
  setLocale(state, lang) {
    if (!lang) {
      return
    }
    state.locale = lang
    if (this.app.i18n) {
      this.app.i18n.locale = lang
    }
    if (global.document) {
      global.document.cookie = 'locale=' + lang
    }
  },
  setCountry(state, country) {
    state.country = country
  }
}
export const actions = {
  nuxtServerInit({ dispatch, commit, state }, { req }) {
    if (req) {
      // Read cookies success
      const user = req.session?.passport?.user
      commit('setUser', user)
    }
  },
  login({ commit }, payload) {
    return this.$axios
      .post('/session', payload, { withCredentials: true })
      .then((response) => {
        const user = response.data.user
        commit('setUser', user)
        return user
      })
  },
  logout({ commit }) {
    commit('setUser', null)
    return this.$axios.delete('/session')
  },
}
export const getters = {
  avatarURL(state) {
    return (size) => {
      let url = `${process.env.apiURL}/users/${state.user.id}/avatar`
      if (size) url += '?size=' + size
      return url
    }
  }
}
