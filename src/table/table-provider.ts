import { IResolvers } from 'graphql-tools';
import { v4 as uuidv4 } from 'uuid';
import { Table } from './models';
import UserProvider from '../user/user-provider';
import { User } from '../user/models';

const tables: Table[] = [{
  id: '1',
  createdBy: '1',
  maxPlayers: 2,
  createdOn: Date.now().toString(),
  invitees: ['1'],
  participants: ['1'],
}];

const getTables = async (): Promise<Table[]> => {
  return tables;
};

const getTableById= async (tableId: string): Promise<Table | undefined> => {
  return tables.find(table => table.id === tableId);
};

const createTableForUser = (userId: string): Table => {
  const newTable = {
    id: `${uuidv4()}`,
    createdBy: userId,
    createdOn: Date.now().toString(),
    maxPlayers: 2,
    invitees: [userId],
    participants: [userId],
  } as Table;
  tables.push(newTable);
  return newTable;
};

const joinTable = async(tableId: string, userId: string): Promise<Table> => {
  const table = tables.find((t) => t.id === tableId);
  if (!table) {
    throw new Error(`The table you requested (${tableId}) does not exist.`);
  }
  const existingUser = table.participants.find((u) => u === userId);
  if (existingUser) {
    throw new Error(`This user is already a participant at this table`);
  }
  if (table.participants.length === table.maxPlayers) {
    throw new Error('This table is full');
  }
  table.participants.push(userId);
  return table;
};

export default { 
  getTables,
  getTableById,
  createTableForUser,
  joinTable, 
};
