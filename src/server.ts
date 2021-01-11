import express from 'express';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import passport from 'passport';
import session from 'express-session';
import authenticate from './auth/authenticate';
import {v4 as uuidv4 } from 'uuid';
import depthLimit from 'graphql-depth-limit';
import { createServer } from 'http';
import compression from 'compression';
import cors from 'cors';
import config from './config';
import SESSION_SECRET from './user/session-secret';
import UserModel from './user/user-provider';
import schema from './schema';

const PORT = 3000;


const app = express();

app.use(session({
  genid: (req) => uuidv4(),
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

const server = new ApolloServer({
  schema,
  context: async ({ req, res }) => {
    return {
      setResponseHeader: (token: string) =>
        res.setHeader('set-cookie', token),
      UserModel,
      getCurrentUser: async() => {
        const user = await authenticate(req.headers.authorization || '', config.jwt, UserModel);
        if (!user) {
          throw new AuthenticationError('You must be logged in');
        }
        return user;
      }
    };
  },
  validationRules: [depthLimit(7)],
  tracing: true
});

app.use('*', cors());
app.use(compression());

server.applyMiddleware({ app, path: '/graphql' });

const httpServer = createServer(app);
httpServer.listen(
  { port: PORT },
  (): void => console.log(`\n🚀      GraphQL is now running on http://localhost:${PORT}/graphql`));