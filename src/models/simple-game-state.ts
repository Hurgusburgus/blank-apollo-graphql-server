
export interface GameState {
    player1: Player;
    player2: Player;
    turnCount: number;
    currentTurn: string; 
}

interface Player {
    id: string;
    state: PlayerState;


}


interface User {
    id: string;
    username: string;
    nickname: string;
}

interface PlayerState {
    left: number;
    right: number;
}