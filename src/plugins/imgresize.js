import Vue from 'vue'

const URL = process.server ? require('url').URL : window.URL

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
  brightness: 'bri',
}

const ImageURL = new URL(process.env.imageURL)
const ImageHost = ImageURL.host

function resize(path, options) {
  if (!path) {
    return null
  }
  const url = new URL(path, process.env.webURL)
  url.host = ImageHost

  for (const key in options) {
    const urlKey = keyMappings[key]
    if (urlKey) {
      url.searchParams.append(urlKey, options[key].toString())
    }
  }
  return url.href
}

export default function () {
  Vue.mixin({
    methods: {
      $img: resize,
    }
  })
}
