import Vue from 'vue'

const keyMappings = {
  // https://docs.imgix.com/apis/url/size/crop
  // top, bottom, left, right, faces, focalpointt, edges, entropy
  cropMode: 'crop',

  // https://docs.imgix.com/apis/url/size/fit
  // clamp, clip, crop, facearea, fill, fillmax, max, min, scale
  fitMode: 'fit',

  // https://docs.imgix.com/apis/url/size/h
  height: 'h',
  width: 'w',
  maxHeight: 'max-h',
  maxWidth: 'max-w',
  minHeight: 'min-h',
  minWidth: 'min-w',
}
function resize(path, options) {
  if (!path) {
    return null
  }
  const url = new URL(path)
  url.host = process.env.imageURL
  for (const key in options) {
    const urlKey = keyMappings[key]
    if (urlKey) {
      url.searchParams.append(urlKey, options[key].toString())
    }
  }
  return url.href
}
function avatar(path, size) {
  if (!path) {
    path = 'https://www.gravatar.com/avatar?f=y&d=mp'
  }
  if (!size) {
    return path
  }
  const url = new URL(path)
  if (path.host.includes('gravatar')) {
    // Served from Gravatar
    url.searchParams.append('s', size)
  } else {
    // Served from GCS
    url.host = process.env.imageURL
    url.searchParams.append('h', size)
    url.searchParams.append('w', size)
  }
  return url.href
}

export default function () {
  Vue.mixin({
    methods: {
      $img: resize,
      $avatar: avatar,
    }
  })
}
