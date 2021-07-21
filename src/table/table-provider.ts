import { IResolvers } from 'graphql-tools';
import { v4 as uuidv4 } from 'uuid';
import { Table, TableAccess } from './models';
import UserProvider from '../user/user-provider';
import { User } from '../user/models';

const tables: Table[] = [{
  id: '1',
  gameInfoId: '1',
  access: TableAccess.PUBLIC,
  createdBy: '1',
  maxPlayers: 2,
  createdOn: Date.now().toString(),
  invitees: ['1'],
  participants: ['1'],
},
{
  id: '2',
  gameInfoId: '1',
  access: TableAccess.PUBLIC,
  createdBy: '2',
  maxPlayers: 2,
  createdOn: Date.now().toString(),
  invitees: ['1'],
  participants: ['2'],
}];

const getPublicTables = async (): Promise<Table[]> => {
  return tables.filter(table => table.access === TableAccess.PUBLIC);
}

const getInviteeTablesForUser = async (userId: string): Promise<Table[]> => {
  return tables.filter(table => table.invitees.includes(userId));
}

const getParticipantTablesForUser = async (userId: string): Promise<Table[]> => {
  return tables.filter(table => table.participants.includes(userId));
}

const getTableById= async (tableId: string): Promise<Table | undefined> => {
  return tables.find(table => table.id === tableId);
};

const createTableForUser = (
  userId: string,
  gameInfoId: string,
  access: TableAccess
): Table => {
  const newTable = {
    id: `${uuidv4()}`,
    gameInfoId,
    access,
    createdBy: userId,
    createdOn: Date.now().toString(),
    maxPlayers: 2,
    invitees: [userId],
    participants: [userId],
  } as Table;
  tables.push(newTable);
  return newTable;
};

const inviteToTable = (tableId: string, userId: string) => {
  const table = tables.find((t) => t.id === tableId);
  if (!table) {
    throw new Error(`Table ${tableId} does not exist.`);
  }
  table.invitees.push(userId);
  return table;
}

const joinTable = async(tableId: string, userId: string): Promise<Table> => {
  const table = tables.find((t) => t.id === tableId);
  if (!table) {
    throw new Error(`Table ${tableId} does not exist.`);
  }
  table.participants.push(userId);
  return table;
};

export default { 
  getPublicTables,
  getInviteeTablesForUser,
  getParticipantTablesForUser,
  getTableById,
  createTableForUser,
  joinTable,
  inviteToTable, 
};
