import { v4 as uuid } from 'uuid';
import safeCompare from 'safe-compare';
import { hashSync } from 'bcrypt';
import { User } from './models';

export interface UserModel {
  createUser: (email: string, username: string, password: string) => Promise<User>;
  getUser: (username: string, password: string) => Promise< User | undefined>;
  getUsers: () => Promise<User[]>;
}

const users: User[] = [
  {
    id: '1',
    email: 'admin@admin.net',
    username: 'admin',
    password: hashSync('admin', 10),
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

const getUsers = async () => users;

export default { createUser, getUser, getUsers } as UserModel;
