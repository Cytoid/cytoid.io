export default ({ store, $axios, error }) => {
  // If the page was server rendered, state.user is either null or a user object
  // Otherwise it would be false (initial state)
  if (store.state.user === false) { // If user state is untouched
    return $axios.get('/session')
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
}
