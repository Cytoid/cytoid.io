export function formatBytes (bytes) {
  if ((bytes >> 30) & 0x3FF) {
    bytes = (bytes >>> 30) + '.' + (bytes & (3 * 0x3FF)).toString().substring(0, 2) + ' GB'
  } else if ((bytes >> 20) & 0x3FF) {
    bytes = (bytes >>> 20) + '.' + (bytes & (2 * 0x3FF)).toString().substring(0, 2) + ' MB'
  } else if ((bytes >> 10) & 0x3FF) {
    bytes = (bytes >>> 10) + '.' + (bytes & (0x3FF)).toString().substring(0, 2) + ' KB'
  } else if ((bytes >> 1) & 0x3FF) {
    bytes = (bytes >>> 1) + 'Bytes'
  } else {
    bytes = bytes + 'Byte'
  }
  return bytes
}

export function Meta (title, description, verb = null) {
  if (description.length > 100) {
    description = description.substring(0, 100)
  }
  this.title = title + ' - Cytoid'
  if (verb) {
    this.title = verb + ' ' + this.title
  }
  this.meta = [
    { hid: 'description', name: 'description', content: description },
    { hid: 'og:description', name: 'og:description', content: description },
    { hid: 'name', name: 'name', content: title },
    { hid: 'og:title', name: 'og:title', content: title },
  ]
}

Meta.prototype.extend = function (id, content) {
  this.meta.push({
    hid: id,
    name: id,
    content
  })
}
