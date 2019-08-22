const { join } = require('path')
const i18nExtensions = require('vue-i18n-extensions')

module.exports = function () {
  this.extendBuild((config) => {
    config.module.rules.push({
      resourceQuery: /blockType=i18n/,
      type: 'javascript/auto',
      loader: '@kazupon/vue-i18n-loader'
    })
  })
  this.addPlugin({
    src: join(__dirname, '../plugins/i18n.js'),
  })
  this.options.render.bundleRenderer.directives = this.options.render.bundleRenderer.directives || {}
  this.options.render.bundleRenderer.directives.t = i18nExtensions.directive
}
