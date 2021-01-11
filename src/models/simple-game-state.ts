export interface GameState {
  player1: Player;
  player2: Player;
  turnCount: number;
  currentTurn: string;
}

export interface Player {
  id: string;
  left: number;
  right: number;
}

interface User {
  id: string;
  username: string;
  nickname: string;
}
