import { SimpleGameState, SimpleGamePlayer, Side, Attack } from './models';

const verifyGameState = (gameState: SimpleGameState, userId: string): void => {
 
  if (gameState.winner) {
    throw new Error('This game is over');
  }
  const {players, currentPlayerKey} = gameState;
  const currentPlayer = players.find(player => player.key === currentPlayerKey);
  if (!currentPlayer || currentPlayer.userId !== userId) {
    throw new Error('It is not your turn');
  }
};

const finishTurn = (gameState: SimpleGameState): SimpleGameState => {
  const { currentPlayerKey, nextPlayerKey, players } = gameState;
  const currentPlayer = players.find(player => player.key === currentPlayerKey) as SimpleGamePlayer;
  const nextPlayer = players.find(player => player.key === nextPlayerKey) as SimpleGamePlayer;
  
  // Win condition
  if(nextPlayer.left === 0 && nextPlayer.right === 0) {
    gameState.winner = currentPlayer.id;
    return gameState;
  }

  gameState.currentPlayerKey = nextPlayer.key;
  gameState.nextPlayerKey = currentPlayer.key;
  gameState.turnCount += 1;
  return gameState;
}

const split = (gameState: SimpleGameState, userId: string): SimpleGameState => {
  verifyGameState(gameState, userId);
  const { currentPlayerKey, players } = gameState;
  const currentPlayer = players.find(player => player.key === currentPlayerKey) as SimpleGamePlayer;
  if(!(currentPlayer.left === 0 || currentPlayer.right === 0)) {
      throw new Error('you must have one dead hand to split');
  }
  if (currentPlayer.left + currentPlayer.right % 2 === 1) {
      throw new Error('You must have an even number of fingers to split');
  }
  const newHand = (currentPlayer.left + currentPlayer.right) / 2;
  const updatePlayer = {
    ...currentPlayer,
    left: newHand,
    right: newHand,
  }
  return finishTurn(gameState);
}



const attack = (gameState: SimpleGameState, userId: string, attack: Attack): SimpleGameState => {
  verifyGameState(gameState, userId);
  const { currentPlayerKey, nextPlayerKey, players } = gameState;
  const currentPlayer = players.find(player => player.key === currentPlayerKey) as SimpleGamePlayer;
  const nextPlayer = players.find(player => player.key === nextPlayerKey) as SimpleGamePlayer;
  if (currentPlayer.userId !== userId) {
    throw new Error('It is not your turn');
  }
  const { attackingSide, receivingSide} = attack;
  if(currentPlayer[attackingSide] === 0) {
      throw new Error('you may not attack with a dead hand');
  }
  if (nextPlayer[receivingSide] === 0) {
      throw new Error('You may not attack a dead hand');
  }
  nextPlayer[receivingSide] = (nextPlayer[receivingSide] + currentPlayer[attackingSide]) % 5;
  return finishTurn(gameState);
}

export default {attack, split};