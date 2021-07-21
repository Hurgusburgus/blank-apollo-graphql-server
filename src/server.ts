import express from 'express';
import { ApolloServer, AuthenticationError, defaultPlaygroundOptions } from 'apollo-server-express';
import cookieParser from 'cookie-parser';
import expressPlayground from 'graphql-playground-middleware-express';
import session from 'express-session';
import {authenticate, GraphQLWhitelistEntry, isRequestWhitelisted} from './auth/authenticate';
import {v4 as uuidv4 } from 'uuid';
import depthLimit from 'graphql-depth-limit';
import { createServer } from 'http';
import compression from 'compression';
import csurf from 'csurf';
import cors from 'cors';
import config from './config';
import SESSION_SECRET from './user/session-secret';
import UserModel from './user/user-provider';
import schema from './schema';

const whiteList: GraphQLWhitelistEntry[] = [
  {
    query: 'mutation',
    endpoint: 'login',
  },
  {
    query: 'mutation',
    endpoint: 'signup',
  },
  {
    query: 'query',
    endpoint: '__schema',
  }
];

const PORT = 3000;


const app = express();

app.use(session({
  genid: (req) => uuidv4(),
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(cookieParser());

const csrfProtection = csurf({
  cookie: true,
});

app.use(csrfProtection);

app.get('/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken()})
});

const server = new ApolloServer({
  schema,
  context: async ({ req, res, connection }) => {
    if (connection) {
      return connection.context;
    }
    if (isRequestWhitelisted(req, whiteList)) {
      return {
        setResponseCookie: (token: string) => res.cookie( 'token', `Bearer ${token}`, { httpOnly: true }), 
      };
    }
    const currentUser = await authenticate(req.cookies.token || '', config.jwt, UserModel);
    return { currentUser };
  },
  validationRules: [depthLimit(7)],
  tracing: true,
  playground: false,
});

app.use('*', cors());
app.use(compression());

app.get('/graphql', (req, res, next) => {
  const headers = JSON.stringify({
    'X-CSRF-Token': req.csrfToken(),
  });
  return expressPlayground({
    ...defaultPlaygroundOptions,
    endpoint: `/graphql?headers=${encodeURIComponent(headers)}`,
    version: '1.7.26',
    // @ts-ignore
    settings: { 
      ...defaultPlaygroundOptions.settings,
      'request.credentials': 'same-origin',
    },
  })(req, res, next);
})

server.applyMiddleware({ app, path: '/graphql' });

const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(
  { port: PORT },
  (): void => {
    console.log(`\n🚀      GraphQL is now running on http://localhost:${PORT}/graphql`);
    console.log(`\n🚀      GraphQL is now running on ws://localhost:${PORT}/graphql`)
  }
);