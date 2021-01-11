import { IResolvers } from 'graphql-tools';
import { GameState, Player } from './models/simple-game-state';
import {User, Table, Participant} from './models/table';
import { ApolloError } from 'apollo-server-express';

const initialGameState: GameState = {
    player1: {
        id: '1',
        left: 1,
        right: 1
    },
    player2: {
        id: '2',
        left: 1,
        right: 1,
    },
    turnCount: 1,
    currentTurn: '1'
}

let gameState = JSON.parse(JSON.stringify(initialGameState));
let users: User[] = [];
let tables: Table[] = [];

let userIndex = 0;
let tableIndex = 0;

const createTable = (user: User): Table => {
  tableIndex = tableIndex + 1;
  const newTable = {
    id: `${tableIndex}`,
    host: user,
    participants: [{
      user,
      playerNum: 1,
    } as Participant],
  } as Table;
  tables.push(newTable);
  return newTable;
}

const joinTable = (tableId: string, user: User) => {
  const table = tables.find(t => t.id === tableId);
  if (!table) {
    throw new ApolloError(`The table you requested (${tableId}) does not exist.`);
  }
  const existingUser = table.participants.find(p => p.user.id === user.id);
  if (existingUser) {
    throw new ApolloError (`This user is already a participant at this table`);
  }
  const playerNum = table.participants.reduce((num, curr) => Math.max(num, curr.playerNum), 0) + 1;
  table.participants.push({
    playerNum,
    user
  } as Participant);
  return table;
}

const attack = (attackingSide: string, receivingSide: string) => {
    const attacker = gameState.currentTurn === '1' ? gameState.player1 : gameState.player2;
    if(attacker[attackingSide] === 0) {
        throw new ApolloError('you may not attack with a dead hand');
    }
    const receiver = gameState.currentTurn === '1' ? gameState.player2 : gameState.player1;
    if (receiver[receivingSide] === 0) {
        throw new ApolloError('You may not attack a dead hand');
    }
    receiver[receivingSide] = (receiver[receivingSide] + attacker[attackingSide]) % 5;
}

const resolverMap: IResolvers = {
  Side: {
      LEFT: 'left',
      RIGHT: 'right'
  },
  Query: {
    getGameState: () =>{
        return gameState;
    },
    getTables: () => {
      return tables;
    }
  },
  Mutation: {
      createUser(parents, args, context, info) {
        return createUser(args.email, args.username, args.password);
      },
      attack(parent, args, context, info) {
          attack(args.attackingSide, args.receivingSide);
          gameState.currentTurn = gameState.currentTurn === '1' ? '2' : '1';
          gameState.turnCount += 1;
          return gameState;
      },
      createTable(parents, args, context, info) {
        const user = context.user;
        return createTable(user);
      },
      joinTable(parents, args, context, info) {
        const tableId = args.tableId;
        const user = context.user;
        return joinTable(tableId, user);
      }
  }
};

export default resolverMap;
