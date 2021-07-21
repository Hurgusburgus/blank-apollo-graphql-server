import 'graphql-import-node';
import { makeExecutableSchema, mergeTypeDefs } from 'graphql-tools';
import { merge } from 'lodash';
import * as rootSchema from './root.graphql';
import userResover from  './user/user-resolver';
import * as ChatSchema from './chat/chat.graphql';
import chatResolver from './chat/chat-resolver';
import * as userSchema from './user/user.graphql';
import tableResolver from './table/table-resolver';
import * as tableSchema from './table/table.graphql';
import GameInfoResolver from './game-info/game-info-resolver';
import * as gameInfoSchema from './game-info/game-info.graphql';
import simpleGameResolver from './simple-game/simple-game-resolver';
import * as simpleGameSchema from './simple-game/simple-game.graphql';


const schema = makeExecutableSchema({
  typeDefs: mergeTypeDefs([
    rootSchema, 
    ChatSchema,
    gameInfoSchema,
    simpleGameSchema, 
    userSchema, 
    tableSchema,
  ]),
  resolvers: merge(
    chatResolver,
    GameInfoResolver,
    simpleGameResolver, 
    userResover, 
    tableResolver,
  )
});
export default schema;
