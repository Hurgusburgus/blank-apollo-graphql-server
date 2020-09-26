import { IResolvers } from 'graphql-tools';
import { GameState } from './models/simple-game-state';

const initialGameState: GameState = {
    player1: {
        id: '1',
        state: {
            left: 1,
            right: 1
        },
        
    },
    player2: {
        id: '2',
        state: {
            left: 1,
            right: 1,
        }
    },
    turnCount: 1,
    currentTurn: '1'
}

let gameState = initialGameState;

const resolverMap: IResolvers = {
  Query: {
    getGameState: () =>{
        console.log('test');
        return gameState;
    },
  },
};


export default resolverMap;