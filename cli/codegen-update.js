import config from 'config'
import * as dotenv from 'dotenv'
import child_process from 'child_process'

(() => {
  dotenv.config()
  const url = config.get('serviceURLServer')
  const gqlUrl = `${url}/graphql`
  const ua = process.env.SERVICES_UA
  const output = './gql/schema.graphql'
  
  const command = `npx get-graphql-schema -h 'user-agent=${ua}' ${gqlUrl} > ${output}`
  console.log('$', command)
  child_process.exec(command)
})();
