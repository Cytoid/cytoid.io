export function formatBytes(bytes) {
  if ((bytes >> 30) & 0x3FF) {
    bytes = (bytes >>> 30) + '.' + (bytes & (3 * 0x3FF)) + ' GB'
  } else if ((bytes >> 20) & 0x3FF) {
    bytes = (bytes >>> 20) + '.' + (bytes & (2 * 0x3FF)) + ' MB'
  } else if ((bytes >> 10) & 0x3FF) {
    bytes = (bytes >>> 10) + '.' + (bytes & (0x3FF)) + ' KB'
  } else if ((bytes >> 1) & 0x3FF) {
    bytes = (bytes >>> 1) + 'Bytes'
  } else {
    bytes = bytes + 'Byte'
  }
  return bytes
}
