import { IResolvers } from 'graphql-tools';
import { v4 as uuidv4 } from 'uuid';
import { Table } from './models';
import UserProvider from '../user/user-provider';
import TableProvider from './table-provider';
import { User } from '../user/models';


const resolverMap: IResolvers = {
  Table: {
    createdBy: async (obj: Table, args, context, info) => {
      return await UserProvider.getUserById(obj.createdBy);
    },
    participants: async (obj: Table, args, context, info) => {
      return obj.participants ? obj.participants.map(async userId => 
        await UserProvider.getUserById(userId)
      ) : null;
    },
  },
  Query: {
    tables: async (parents, args, context, info) => {
      // const user = await context.getCurrentUser();
      // if (!user) {
      //   throw new Error('You must be logged in');
      // }
      // return tables.filter(t => t.participants.includes(user.id));
      return await TableProvider.getTables();
    },
  },
  Mutation: {
    createTable: async (parents, args, context, info) => {
      const user: User = await context.getCurrentUser();
      if (!user) {
        throw new Error('You must be logged in');
      }
      return TableProvider.createTableForUser(user.id);
    },
    joinTable: async (parents, { tableId }, context, info) => {
      const user = await context.getCurrentUser();
      return await TableProvider.joinTable(tableId, user.id);
    },
  },
};

export default resolverMap;
