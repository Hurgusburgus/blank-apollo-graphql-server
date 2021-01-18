import 'graphql-import-node';
import * as typeDefs from './chat.graphql';
import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './chat-resolver';
import { GraphQLSchema } from 'graphql';

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
export default schema;
