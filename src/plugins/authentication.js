export default ({ app, store, $axios }) => {
  // If the page was server rendered, state.user is either false or a user object
  if (store.state.user !== null) { // If user state was never initialized
    return $axios.get('/session')
      .then((res) => {
        const data = res.data
        const user = data.user
        store.commit('setUser', user)
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          // User not logged in
          return
        }
        throw error
      })
  }
}
