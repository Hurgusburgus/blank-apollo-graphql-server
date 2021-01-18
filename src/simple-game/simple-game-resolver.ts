import { IResolvers } from 'graphql-tools';
import { MoveInput, MoveType, SimpleGameState } from './models';
import SimpleGameLogicService from './simple-game-logic-service';
import SimpleGameProvider from './simple-game-provider';
import { User } from '../user/models';


const resolverMap: IResolvers = {
  Side: {
    LEFT: 'left',
    RIGHT: 'right'
  },
  MoveType: {
    ATTACK: 'attack',
    SPLIT: 'split'
  },
  Query: {
    gameState: async (parents, args, context, info) => await SimpleGameProvider.getGameById(args.gameId),
  },
  Mutation: {
    takeTurn: async (parents, { input }, context, info) => {
      const { gameId, moveType, attack}: MoveInput = input;
      const user: User = await context.getCurrentUser();
      const gameState = await SimpleGameProvider.getGameById(gameId);
      if (!gameState) {
        throw new Error(`Game with id '${gameId}' not found.`);
      }
      if(moveType === MoveType.ATTACK) {
        const update = SimpleGameLogicService.attack(gameState, user.id, attack);
        const updated = await SimpleGameProvider.updateGameState(gameId, update);
        return update;
      } else if (moveType === MoveType.SPLIT) {
        const update = SimpleGameLogicService.split(gameState, user.id);
        const updated = await SimpleGameProvider.updateGameState(gameId, update);
        return update;
      } else {
        throw new Error(`Unrecognized Move: '${moveType}'`);
      }
    }
  },
};

export default resolverMap;
