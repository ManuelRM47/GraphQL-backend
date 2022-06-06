import { ApolloServer } from 'apollo-server';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
//import { getUserId } from './utils.js';
import { connectDB } from './config/db.js';
import user from './models/users.js';
import generate from './models/generation.js';
import company from './models/companies.js';
import device from './models/devices.js';
import record from './models/records.js';
import Validation from "./validation/joi.schemas.js";
import * as Query from './resolvers/Query.js';
import * as Mutation from './resolvers/Mutation.js';
import * as User from './resolvers/User.js';
import * as Company from'./resolvers/Company.js';
// import * as Subscription from'./resolvers/Subscription.js';
// import * as Vote from'./resolvers/Vote.js';

// const pubsub = new PubSub();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resolvers = {
    Query,
    Mutation,
    User,
    // Subscription,
    // User,
    // Link,
    // Vote
  }


const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, 'schema.graphql'),
        'utf8'
      ),
    resolvers,
    context: ({ req }) => {
        return {
          ...req,
          user,
          validation: Validation,
          generate,
          company,
          device,
          record,
        //   userId:
        //     req && req.headers.authorization
        //       ? getUserId(req)
        //       : null
        };
    }
});

connectDB();
server.listen()
    .then(({url}) => 
        console.log(`Server is tunning on ${url}`)
    );

