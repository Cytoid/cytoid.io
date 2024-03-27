export function truncateNum(num: number, digits = 2) {
  return (Math.trunc(num * 10 ** digits) / 10 ** digits).toFixed(digits)
}

export function formatBytes(bytes: number) {
  if ((bytes >> 30) & 0x3FF) {
    return `${bytes >>> 30
      }.${(bytes & (3 * 0x3FF)).toString().substring(0, 2)} GB`
  }
  else if ((bytes >> 20) & 0x3FF) {
    return `${bytes >>> 20
      }.${(bytes & (2 * 0x3FF)).toString().substring(0, 2)} MB`
  }
  else if ((bytes >> 10) & 0x3FF) {
    return `${bytes >>> 10
      }.${(bytes & (0x3FF)).toString().substring(0, 2)} KB`
  }
  else if ((bytes >> 1) & 0x3FF) {
    return `${bytes >>> 1
      } Bytes`
  }
  else { return `${bytes} Byte` }
}
