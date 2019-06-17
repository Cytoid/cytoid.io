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
  path = path.replace(process.env.assetURL, process.env.imageURL)
  const optionArr = []
  for (const key in keyMappings) {
    if (keyMappings.hasOwnProperty(key) && options[key]) {
      optionArr.push(keyMappings[key] + '=' + options[key])
    }
  }
  if (optionArr.length > 0) {
    path += '?' + optionArr.join('&')
  }
  return path
}

export default function () {
  Vue.mixin({
    methods: {
      $img: resize
    }
  })
}
