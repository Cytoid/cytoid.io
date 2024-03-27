import child_process from 'node:child_process'
import config from 'config'
import * as dotenv from 'dotenv'

(() => {
  dotenv.config()
  const url = config.get('serviceURLServer')
  const gqlUrl = `${url}/graphql`
  const ua = import.meta.env.SERVICES_UA
  const output = './gql/schema.graphql'

  const command = `npx get-graphql-schema -h 'user-agent=${ua}' ${gqlUrl} > ${output}`
  // eslint-disable-next-line no-console
  console.log('$', command)
  child_process.exec(command)
})()
