import 'graphql-import-node';
import * as typeDefs from './user.graphql';
import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './user-resolver';
import { GraphQLSchema } from 'graphql';

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
export default schema;
