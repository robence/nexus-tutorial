import { makeSchema } from 'nexus'
import { join } from 'path'
import * as typeDefs from './graphql'

export const schema = makeSchema({
  types: typeDefs,
  outputs: {
    typegen: join(__dirname, '..', 'nexus-typegen.ts'),
    schema: join(__dirname, '..', 'schema.graphql'),
  },
  contextType: {
    module: require.resolve('./context'),
    export: 'Context',
  },
})
