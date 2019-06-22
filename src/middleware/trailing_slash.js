export default function ({ route, redirect }) {
  if (route.fullPath.endsWith('/')) {
    redirect(route.fullPath.slice(0, -1))
  }
}
