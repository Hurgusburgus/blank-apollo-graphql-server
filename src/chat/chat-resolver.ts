import { IResolvers } from 'graphql-tools';
import { v4 as uuidv4 } from 'uuid';
import { Chat, Comment } from './models';
import UserProvider from '../user/user-provider';
import ChatProvider from './chat-provider';
import { PubSub, withFilter } from 'apollo-server-express';

const pubSub = new PubSub();

const COMMENT_POSTED = 'COMMENT_POSTED';


const resolverMap: IResolvers = {
  Comment: {
    author: async (obj: Comment, args, context, info) => {
      return await UserProvider.getUserById(obj.author);
    },
  },
  Query: {
    chat: async (parents, args, context, info) => {
      if (args.id) {
        return await ChatProvider.getChatById(args.id);
      } else if ( args.tableId) {
        return await ChatProvider.getChatByTableId(args.tableId);
      } else {
        throw new Error("You must provide an Id");
      }
    },
  },
  Mutation: {
    createChat: async (parents, args, context, info) => {
      return ChatProvider.createChatForTable(args.tableId, args.participants);
    },
    postComment: async (parents, { chatId, author, content }, context, info) => {
      // const user = await context.getCurrentUser();
      const commentPosted = await ChatProvider.postCommentToChat(chatId, author, content);
      pubSub.publish(COMMENT_POSTED, { commentPosted })
      return commentPosted;
    },
  },
  Subscription: {
    commentPosted: {
      subscribe: withFilter( 
        () => pubSub.asyncIterator([COMMENT_POSTED]),
        (payload, variables) => {
          const chatMatch = payload.commentPosted.chatId === variables.chatId;
          return chatMatch;
        }
      ),
    },
  },
};

export default resolverMap;
