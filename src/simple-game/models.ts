export interface SimpleGameState {
  id: string;
  players: SimpleGamePlayer[];
  turnCount: number;
  currentPlayerKey: number;
  nextPlayerKey: number;
  winner?: string;
};

export interface SimpleGamePlayer {
  id: string;
  key: number;
  userId: string;
  left: number
  right: number;
};

export enum Side {
  LEFT = 'left',
  RIGHT = 'right',
};

export enum MoveType {
  ATTACK = "attack",
  SPLIT = "split",
}

export interface Attack {
  attackingSide: Side;
  receivingSide: Side;
};

export interface MoveInput {
  gameId: string;
  moveType: MoveType;
  attack: Attack;
};