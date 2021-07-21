import { IResolvers } from 'graphql-tools';
import { GameInfo } from './models';
import GameInfoProvider from './game-info-provider';

const resolverMap: IResolvers = {
  Query: {
    gameInfo: async (parents, {gameInfoId}, context, info) => {
      return await GameInfoProvider.getGameInfoById(gameInfoId);
    },
  },
};

export default resolverMap;
