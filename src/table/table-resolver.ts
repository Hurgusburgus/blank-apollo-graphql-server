import { IResolvers } from 'graphql-tools';
import { v4 as uuidv4 } from 'uuid';
import { Table, TableAccess } from './models';
import GameInfoProvider from '../game-info/game-info-provider';
import UserProvider from '../user/user-provider';
import TableProvider from './table-provider';
import { User } from '../user/models';


const resolverMap: IResolvers = {
  Table: {
    gameInfo: async (obj: Table, args, context, info) => {
      return await GameInfoProvider.getGameInfoById(obj.gameInfoId);
    },
    createdBy: async (obj: Table, args, context, info) => {
      return await UserProvider.getUserById(obj.createdBy);
    },
    participants: async (obj: Table, args, context, info) => {
      return obj.participants ? obj.participants.map(async userId => 
        await UserProvider.getUserById(userId)
      ) : null;
    },
    invitees: async (obj: Table, args, context, info) => {
      return obj.invitees ? obj.invitees.map(async userId => 
        await UserProvider.getUserById(userId)
      ) : null;
    },
  },
  TableAccess: {
    PUBLIC: 'public',
    FRIENDS: 'friends',
    INVITE: 'invite',
  },
  Query: {
    table: async (parents, args, context, info) => {
      return await TableProvider.getTableById(args.id);
    },
    myTables: async (parents, args, context, info) => {
      const { currentUser } = context;
      return await TableProvider.getParticipantTablesForUser(currentUser.id);
    },
    myTableInvites: async (parents, args, context, info) => {
      const { currentUser } = context;
      return await TableProvider.getInviteeTablesForUser(currentUser.id);
    },
    publicTables: async (parents, args, context, info) => {
      return await TableProvider.getPublicTables();
    }
  },
  Mutation: {
    createTable: async (parents, args, context, info) => {
      const { gameInfoId, access } = args;
      const user: User = context.currentUser;
      if (!user) {
        throw new Error('You must be logged in');
      }
      return TableProvider.createTableForUser(user.id, gameInfoId, access);
    },
    inviteToTable: async (parents, {tableId, userId}, context, info) => {
      const table = await TableProvider.getTableById(tableId);
      if (!table) {
        throw new Error(`Table ${tableId} does not exist.`);
      }
      if (table.access !== TableAccess.PUBLIC) {
        const currentUser: User = context.currentUser;
        if (currentUser.id !== table.createdBy) {
          throw new Error(`Only the host may invite users to non-public tables`);
        }
      }
      const existingUser = table.invitees.find(u => u === userId);
      if (existingUser) {
        return table;
      }
      return await TableProvider.inviteToTable(tableId, userId);
    },
    joinTable: async (parents, { tableId }, context, info) => {
      const user: User = context.currentUser;
      const table = await TableProvider.getTableById(tableId);
      if (!table) {
        throw new Error(`The table you requested (${tableId}) does not exist.`);
      }
      if (table.access === TableAccess.FRIENDS) {
        const host = await UserProvider.getUserById(table.createdBy);
        if (!host) {
          throw new Error(`Host of table ${tableId} not found`);
        }
        if (!host.friends.includes(user.id)) {
          throw new Error(`Access to table ${table.id} is set to FRIENDS. User ${user.username} is not a friend of the host.`);
        }
      }
      if (table.access === TableAccess.INVITE) {
        if (!table.invitees.includes(user.id)) {
          throw new Error(`Access to table ${table.id} is set to INVITE. User ${user.username} is not invited to this table.`);
        }
      }
      const existingUser = table.participants.find((u) => u === user.id);
      if (existingUser) {
        throw new Error(`This user is already a participant at table ${table.id}`);
      }
      if (table.participants.length === table.maxPlayers) {
        throw new Error('This table is full');
      }
      return await TableProvider.joinTable(tableId, user.id);
    },
  },
};

export default resolverMap;
