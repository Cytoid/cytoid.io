import _config from 'config'
import * as dotenv from 'dotenv'
import type { CodegenConfig } from '@graphql-codegen/cli'

dotenv.config()

const config: CodegenConfig = {
  schema: _config.get('graphql'),
  documents: ['**/*.vue'],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    './gql/': {
      preset: 'client',
      config: {
        useTypeImports: true
      }
    }
  }
}
export default config
