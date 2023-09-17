// use Bun to run this script

import * as fs from 'node:fs'
import * as path from 'node:path'

function mergeTranslations(srcDir: string, destDir: string) {
  fs.readdirSync(srcDir).forEach((filename) => {
    if (filename.endsWith('.json')) {
      const srcFile = path.join(srcDir, filename)
      const destFile = path.join(destDir, filename)
      // eslint-disable-next-line no-console
      console.log(destFile)
      const srcContent = JSON.parse(fs.readFileSync(srcFile, 'utf-8'))
      let destContent = {}
      if (fs.existsSync(destFile)) {
        destContent = JSON.parse(fs.readFileSync(destFile, 'utf-8'))
      }

      copy(srcContent, destContent)

      fs.writeFileSync(destFile, `${JSON.stringify(destContent, null, 2)}\n`)
      function copy(src: MessageSchema, dst: MessageSchema) {
        Object.keys(src).forEach((key) => {
          if (typeof src[key] === 'string') {
            if (!dst[key]) {
              // eslint-disable-next-line no-console
              console.log('-', key)
              dst[key] = src[key]
            }
          }
          else {
            if (!dst[key]) {
              dst[key] = {}
            }
            copy(src[key] as MessageSchema, dst[key] as MessageSchema)
          }
        })
      }
    }
  })
}

const sourceDir = './locale/en/'
const localeDir = './locale/'

const targetDirs = fs.readdirSync(localeDir).filter(d => fs.statSync(path.join(localeDir, d)).isDirectory() && d !== 'en')

targetDirs.forEach((targetDir) => {
  mergeTranslations(sourceDir, path.join(localeDir, targetDir))
})

interface MessageSchema {
  [key: string]: string | MessageSchema
}
