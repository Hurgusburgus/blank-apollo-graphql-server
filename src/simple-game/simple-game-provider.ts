import { v4 as uuidv4 } from 'uuid';
import { SimpleGameState, SimpleGamePlayer, Side, Attack } from './models';

const player1: SimpleGamePlayer = {
  id: '1',
  key: 1,
  userId: '2',
  left: 1,
  right: 1,
};

const player2: SimpleGamePlayer = {
  id: '2',
  key: 2,
  userId: '3',
  left: 1,
  right: 1,
};

let gameStates: SimpleGameState[] = [{
  id: '1',
  players: [player1, player2],
  currentPlayerKey: 1,
  nextPlayerKey: 2,
  turnCount: 1,
}];

const createGame = async (userId1: string, userId2: string): Promise<SimpleGameState> => {
  const player1 = await createPlayer(userId1);
  const player2 = await createPlayer(userId2);
  const newGame = {
    id: `${uuidv4()}`,
    players: [player1, player2],
    turnCount: 1,
    currentPlayerKey: player1.key,
    nextPlayerKey: player2.key,
  } as SimpleGameState;
  gameStates.push(newGame);
  return newGame;
};

const createPlayer = async (userId: string): Promise<SimpleGamePlayer> => (
  {
    id: `${uuidv4()}`,
    userId,
    left: 1,
    right: 1,
  } as SimpleGamePlayer
);

const getGameById = async (gameId: string): Promise<SimpleGameState | undefined> => {
  return gameStates.find(game => game.id === gameId);
};

const updateGameState = async(gameId: string, update: SimpleGameState): Promise<SimpleGameState | undefined> => {
  const gameState = await getGameById(gameId) as SimpleGameState;
  const updatedGameState = {
    ...gameState, 
    ...update,
    players: gameState.players.map((oldPlayer) => {
      const updatedPlayer = update.players.find((newPlayer) => newPlayer.key === oldPlayer.key);
      if (updatedPlayer) {
        return { ...oldPlayer, ...updatedPlayer};
      }
      return oldPlayer;
    }),
  };
  gameStates = gameStates.map(game => game.id === gameState.id ? updatedGameState : game);
  return updatedGameState;
}


export default { 
 createGame,
 createPlayer,
 getGameById,
 updateGameState,
};
