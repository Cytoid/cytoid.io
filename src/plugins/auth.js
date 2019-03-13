export default ({ store, $axios }) => {
  const token = localStorage.getItem('cytoid:token')
  $axios.setToken(store.state.token, 'Bearer')
  store.commit('setToken', token)
  // TODO: Making this happen on the server side as well.
}
