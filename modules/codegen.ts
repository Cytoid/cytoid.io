import { defineNuxtModule } from "@nuxt/kit";
import { generate } from "@graphql-codegen/cli";
import consola from "consola";
import type { Types } from "@graphql-codegen/plugin-helpers";
import { glob } from "glob";


// Module options TypeScript interface definition
export interface CodegenOptions {
  config?: Types.Config,
  debug: boolean,
}

export default defineNuxtModule<CodegenOptions>({
  meta: {
    name: '@teages/nuxt-graphql-codegen',
    configKey: 'graphqlCodegen'
  },
  // Default configuration options of the Nuxt module
  defaults: {
    debug: false,
  },
  setup (options, nuxt) {
    if (!options.config) {
      consola.error('No config provided for graphql-codegen')
    } else {
      const schema = options.config.schema
      const config : Types.Config = {
        ...options.config
      }
      const documents = (Array.isArray(config.documents) ? config.documents : [config.documents]) as string[]
      const generateCode = async () => {
        const start = Date.now();
        await generate({
          ...config,
          silent: true,
        }, false);
        const time = Date.now() - start;
        consola.success(`GraphQL code generated in ${time}ms`);
      }
      nuxt.hook('build:before', async () => {
        consola.start(`Generating GraphQL code`)
        await generateCode()
      })
      nuxt.hook('builder:watch', async (event, path) => {
        const files = documents.map((doc) => glob.sync(doc, {
          absolute: true,
        })).flat()
        if (documents.some((doc) => files.includes(path))) {
          consola.start(`Regenerating GraphQL code: ${path}`)
          generateCode()
        }
      })
    }
  }
})
