import { IResolvers } from 'graphql-tools';
import { compareSync, hashSync } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { ApolloError } from 'apollo-server-express';
import UserProvider from './user-provider';
import config from '../config';

const UserResolverMap: IResolvers = {
  Query: {
    user: (parent, {id}, context) => UserProvider.getUserById(id),
    currentUser: (parent, args, context) => context.currentUser,
  },
  Mutation: {
    login: async (parent, { username, password }, context) => {
      try {
        const user = await UserProvider.getUser(username, password);
        if(!user) {
          throw new Error('User not found');
        }
        const validPass = await compareSync(password, user.password);
        if (!validPass) {
          throw new Error('Password does not match User');
        }
        const tokenUser = { id: user.id, email: user.email, username: user.username }
        const token = sign(tokenUser, config.jwt.JWT_SECRET);
        context.setResponseCookie(token);
        return user;
      } catch (error) {
        throw new ApolloError(error.message);
      }
    },
    logout: (parent, args, context) => context.logout(),
    signup: async (parent, { email, username, password }, context) => {
      const hash = hashSync(password, 10);
      const newUser = UserProvider.createUser(email, username, hash);
      const token = sign(newUser, config.jwt.JWT_SECRET);
      return { user: newUser, token };
    },
  },
};

export default UserResolverMap;
