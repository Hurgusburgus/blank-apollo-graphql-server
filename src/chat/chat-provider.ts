import { IResolvers } from 'graphql-tools';
import { v4 as uuidv4 } from 'uuid';
import { Chat, Comment } from './models';
import UserProvider from '../user/user-provider';
import { User } from '../user/models';

const chats: Chat[] = [{
  id: '1',
  tableId: '1',
  participants: ['1', '2'],
  comments: [],
}];

const getChatById = async (id: string): Promise<Chat | undefined> => {
  return chats.find(c => c.id === id);
};

const getChatByTableId = async (tableId: string): Promise<Chat | undefined> => {
  return chats.find(c => c.tableId === tableId);
};

const createChatForTable = async (tableId: string, participants: string[]): Promise<Chat> => {
  const newChat = {
    id: `${uuidv4()}`,
    tableId,
    participants,
    comments: [],
  } as Chat;
  chats.push(newChat);
  return newChat;
};

const postCommentToChat = async(chatId: string, author: string, content: string): Promise<Comment> => {
  const newComment = {
    chatId,
    author,
    content,
    timestamp: Date.now(),
  } as Comment;
  const chat = chats.find(c => c.id === chatId);
  if(chat) {
    chat.comments = [ newComment, ...chat.comments ];
    return newComment;
  }
  throw new Error(`Chat with id '${chatId}' not found.`);
}


export default { 
  getChatById,
  getChatByTableId,
  createChatForTable,
  postCommentToChat,
};
