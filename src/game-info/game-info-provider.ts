import { GameInfo } from './models';

const gamesInfo: GameInfo[] = [{
  id: '1',
  name: "Chopsticks",
  minPlayers: 2,
  maxPlayers: 2,
}];

const getGameInfoById = async (id: string): Promise<GameInfo | undefined> => {
  return gamesInfo.find(gi => gi.id === id);
};


export default { 
  getGameInfoById
};
