import 'graphql-import-node';
import * as typeDefs from './simple-game.graphql';
import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './simple-game-resolver';
import { GraphQLSchema } from 'graphql';

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
export default schema;
