export default async ({ store, $axios, error }) => {
  // If the page was server rendered, state.user is either null or a user object
  // Otherwise it would be false (initial state)

  if (store.state.user === false) { // If user state is untouched, or if avatar path is unknown
    await $axios.get('/session')
      .then((res) => {
        const data = res.data
        const user = data.user
        store.commit('setUser', user)
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          // User not logged in
          return
        }
        error(err)
      })
  }

  if (store.state.user) {
    const avatar = window.localStorage.getItem('avatar')
    if (avatar) {
      store.commit('setAvatar', avatar)
    }
    store.subscribe((mutation, state) => {
      if (mutation.type !== 'setAvatar') {
        return
      }
      window.localStorage.setItem('avatar', mutation.payload)
    })
    if (!avatar) {
      await $axios.get('/users/' + store.state.user.id)
        .then(res => store.commit('setAvatar', res.data.avatarURL))
    }
  }
}
