const COS = require('cos-nodejs-sdk-v5')
const { readdir } = require('fs').promises
const { resolve, relative } = require('path')

const cos = new COS({
  SecretId: process.env.TENCENT_CLOUD_SECRET_ID,
  SecretKey: process.env.TENCENT_CLOUD_SECRET_KEY,
})


const type = process.argv[2]
const path = process.argv[3]
const bucketName = {
  'site': 'cytoid-1251176855',
  'assets': 'cytoid-assets-1251176855',
  'static': 'cytoid-static-1251176855',
}[type]

async function* walk(dir) {
  const dirents = await readdir(dir, { withFileTypes: true })
  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name)
    if (dirent.isDirectory())
      yield* walk(res)
    else
      yield res
  }
}

function upload(basedir, filepath) {
  const relativePath = relative(basedir, filepath).replace(/\\/g, '/')
  console.log(`Uploading ${relativePath} (${filepath})`)
  return new Promise((resolve, reject) => {
    cos.sliceUploadFile({
      Bucket: bucketName,
      Region: 'ap-guangzhou',
      Key: relativePath,
      FilePath: filepath,
    }, (err, data) => {
      if (err)
        reject(err)
      else
        resolve(data)
    })
  })
}

async function start() {
  if(!type || !path) {
    console.log('Usage: node deploy.js [static|site|assets] [path]')
    return
  }
  for await (let filepath of walk(path)) {
    await upload(path, filepath)
  }
}
start()
