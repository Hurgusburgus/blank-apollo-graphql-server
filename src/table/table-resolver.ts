import { IResolvers } from 'graphql-tools';
import { v4 as uuidv4 } from 'uuid';
import { Table } from './models';

const tables: Table[] = [{
  id: '1',
  createdBy: '1',
  createdOn: Date.now().toString(),
  invitees: ['1'],
  participants: ['1'],
}];

const createTable = (userId: string): Table => {
  const newTable = {
    id: `${uuidv4()}`,
    createdBy: userId,
    createdOn: Date.now().toString(),
    invitees: [userId],
    participants: [userId],
  } as Table;
  tables.push(newTable);
  return newTable;
};

const joinTable = (tableId: string, userId: string) => {
  const table = tables.find((t) => t.id === tableId);
  if (!table) {
    throw new Error(`The table you requested (${tableId}) does not exist.`);
  }
  const existingUser = table.participants.find((u) => u === userId);
  if (existingUser) {
    throw new Error(`This user is already a participant at this table`);
  }
  // const playerNum = table.participants.reduce((num, curr) => Math.max(num, curr.playerNum), 0) + 1;
  table.participants.push(userId);
  return table;
};

const resolverMap: IResolvers = {
  Query: {
    getTables: async (parents, args, context, info) => {
      const user = await context.getCurrentUser();
      if (!user) {
        throw new Error('You must be logged in');
      }
      return tables.filter(t => t.participants.includes(user.id));
    },
  },
  Mutation: {
    createTable(parents, args, context, info) {
      const user = context.currentUser;
      if (!user) {
        throw new Error('You must be logged in');
      }
      return createTable(user.Id);
    },
    joinTable(parents, args, context, info) {
      const tableId = args.tableId;
      const user = context.user;
      return joinTable(tableId, user.id);
    },
  },
};

export default resolverMap;
