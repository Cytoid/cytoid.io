export function useTimer() {
  let startTime = Date.now()
  const { timestamp, pause, resume, isActive } = useTimestamp({ controls: true })
  const passed = computed(() => {
    return timestamp.value - startTime
  })

  function resumeTimer() {
    startTime = startTime + Date.now() - timestamp.value
    resume()
  }

  function pauseTimer() {
    pause()
  }

  function delayTimer(delay: number) {
    startTime = startTime + delay
  }

  function earlyTimer(early: number) {
    startTime = startTime - early
  }

  return {
    passed,
    isActive,
    pause: pauseTimer,
    resume: resumeTimer,
    delay: delayTimer,
    early: earlyTimer,
  }
}
