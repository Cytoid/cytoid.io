export const state = () => ({
  background: null,
})
export const mutations = {
  setBackground(state, background) {
    console.log('background', background)
    state.background = background
  }
}
export const actions = {
}
