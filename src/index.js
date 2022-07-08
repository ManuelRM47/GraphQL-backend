import { ApolloServer } from 'apollo-server-express';
import { createServer } from 'http';
import 'dotenv/config'
import express from 'express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import user from './models/users.js';
import generate from './models/generation.js';
import company from './models/companies.js';
import device from './models/devices.js';
import record from './models/records.js';
import Validation from "./validation/joi.schemas.js";
import * as Query from './resolvers/Query.js';
import * as Mutation from './resolvers/Mutation.js';
import * as Subscription from'./resolvers/Subscription.js';
import * as User from './resolvers/User.js';
import * as Company from'./resolvers/Company.js';
import * as Device from './resolvers/Device.js';
import * as Record from './resolvers/Record.js';
import { DateType } from './resolvers/Date.js';
import { CursorType } from './resolvers/Cursor.js';
import { paginationResolvers } from '@limit0/mongoose-graphql-pagination';


const resolvers = {
  Query,
  Mutation,
  Subscription,
  User,
  Company,
  Device,
  Record,
  Date: DateType,
  Cursor: CursorType,
  RecordConnection: paginationResolvers.connection,
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const typeDefs = fs.readFileSync(
path.join(__dirname, 'schema.graphql'),
'utf8'
);

const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();
const httpServer = createServer(app);

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});

const serverCleanup = useServer(
  { 
    schema,
    context: (ctx, msg, args) => {
      return {
        user,
        validation: Validation,
        generate,
        company,
        device,
        record,
      };
    },
  }, 
  wsServer
);

const server = new ApolloServer({
    schema,
    cache: 'bounded',
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
    context: ({ req }) => {
      return {
        ...req,
        user,
        validation: Validation,
        generate,
        company,
        device,
        record,
      };
    }
});

connectDB();
await server.start();
server.applyMiddleware({ app });

httpServer.listen(process.env.PORT, () => {
console.log(
  `🚀 Query endpoint ready at http://localhost:${process.env.PORT}${server.graphqlPath}`
);
console.log(
  `🚀 Subscription endpoint ready at ws://localhost:${process.env.PORT}${server.graphqlPath}`
);
});

