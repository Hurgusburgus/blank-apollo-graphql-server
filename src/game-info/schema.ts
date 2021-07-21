import 'graphql-import-node';
import * as typeDefs from './game-info.graphql';
import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './game-info-resolver';
import { GraphQLSchema } from 'graphql';

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
export default schema;
