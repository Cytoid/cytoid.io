export function wait(sec: number = 0.001) {
  return new Promise((resolve) => {
    setTimeout(resolve, sec * 1000)
  })
}
