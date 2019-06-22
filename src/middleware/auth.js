export default function auth({ redirect, store }) {
  if (!store.state.user) {
    redirect('/session/signin')
  }
}
