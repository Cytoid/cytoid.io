import legacy from '@vitejs/plugin-legacy'
import { pick } from 'lodash'
import { defineNuxtModule } from 'nuxt/kit'

// Fix vite-legacy build, see https://github.com/nuxt/nuxt/issues/15464
export default defineNuxtModule<Options>({
  meta: {
    name: 'vite-legacy',
    configKey: 'legacy',
  },
  setup(options, nuxt) {
    // if not add config here, would have a `Failed to resolve import "fsevents" from "node_modules\.cache\vite\client\deps\chunk-LZRBBFFE.js?v=02b8f81e". Does the file exist?`
    nuxt.options.vite ??= {}
    nuxt.options.vite.plugins ??= []
    nuxt.options.vite.plugins.unshift(legacy(options))

    nuxt.hook('build:manifest', (manifest) => {
      if (!manifest['vite/legacy-polyfills-legacy']) {
        return
      }

      // Copy of manifest where polyfill is moved to 1st position.
      const manifest_copy: typeof manifest = {
        ...pick(manifest, 'vite/legacy-polyfills-legacy'),
        ...manifest,
      }
      // Clear manifest.
      for (const key of Object.keys(manifest)) {
        delete manifest[key]
      }
      // Fill manifest again from the copy.
      Object.assign(manifest, manifest_copy)

      // Remove module attribute from legacy chunks.
      for (const key of Object.keys(manifest)) {
        if (key.match(/-legacy(\.|$)/)) {
          manifest[key].module = false
        }
      }
    })
  },
})

// from `import legacy from '@vitejs/plugin-legacy'`
interface Options {
  /**
   * default: 'defaults'
   */
  targets?: string | string[] | {
    [key: string]: string
  }
  /**
   * default: false
   */
  ignoreBrowserslistConfig?: boolean
  /**
   * default: true
   */
  polyfills?: boolean | string[]
  additionalLegacyPolyfills?: string[]
  /**
   * default: false
   */
  modernPolyfills?: boolean | string[]
  /**
   * default: true
   */
  renderLegacyChunks?: boolean
  /**
   * default: false
   */
  externalSystemJS?: boolean
  /**
   * default: true
   */
  renderModernChunks?: boolean
}
