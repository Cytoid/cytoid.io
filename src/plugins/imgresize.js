import Vue from 'vue'

const URL = process.server ? require('url').URL : window.URL

const keyMappings = {
  // https://docs.imgix.com/apis/url/size/crop
  // top, bottom, left, right, faces, focalpoint, edges, entropy
  mode: 'rt',

  // https://docs.imgix.com/apis/url/size/h
  height: 'h',
  width: 'w',
  format: 'format',
}

const ImageURL = new URL(process.env.imageURL)
const ImageHost = ImageURL.host

function resize(path, options) {
  if (!path) {
    return null
  }
  const url = new URL(path, process.env.webURL)
  url.host = ImageHost
  url.port = ''
  for (const key in options) {
    const urlKey = keyMappings[key]
    if (urlKey) {
      url.searchParams.append(urlKey, options[key].toString())
    }
  }
  url.searchParams.append('g', 'sm') // default to smart gravity
  return url.href
}

export default function () {
  Vue.mixin({
    methods: {
      $img: resize,
    }
  })
}
