import { v4 as uuid } from 'uuid';
import safeCompare from 'safe-compare';
import { hashSync } from 'bcrypt';
import { User } from './models';

export interface UserModel {
  createUser: (email: string, username: string, password: string) => Promise<User>;
  getUser: (username: string, password: string) => Promise< User | undefined>;
  getUsers: () => Promise<User[]>;
  getUserById: (id: string) => Promise<User | undefined>; 
}

const users: User[] = [
  {
    id: '1',
    email: 'admin@admin.net',
    username: 'admin',
    password: hashSync('admin', 10),
    friends: ['1', '2']
  },
  {
    id: '2',
    email: 'p1@gg.com',
    username: 'p1',
    password: hashSync('p1', 10),
    friends: ['2'],
  },
  {
    id: '3',
    email: 'p2@gg.com',
    username: 'p2',
    password: hashSync('p2', 10),
    friends: ['1'],
  },
];

const createUser = async (
  email: string,
  username: string,
  password: string
): Promise<User> => {
  const existingEmail = users.find((u) => u.email === email);
  if (existingEmail) {
    throw new Error('A user with that email address already exists');
  }
  const existingUsername = users.find((u) => u.username === username);
  if (existingUsername) {
    throw new Error('A user with that username already exists');
  }
  const newUser = {
    id: uuid(),
    email,
    username,
    password,
  } as User;
  users.push(newUser);
  return newUser;
};

const getUser = async (username: string, password: string): Promise< User | undefined> => {
  return users.find(
    (user) =>
      (safeCompare(user.username, username) ||
        safeCompare(user.email, username))
  );
};

const getUserById = async (id: string): Promise<User | undefined> => {
  return users.find((user) => user.id === id);
}

const getUsers = async () => users;

export default { createUser, getUser, getUsers, getUserById } as UserModel;
