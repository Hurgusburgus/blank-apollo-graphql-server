import 'graphql-import-node';
import * as typeDefs from './table.graphql';
import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './table-resolver';
import { GraphQLSchema } from 'graphql';

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
export default schema;
