import { ApolloServer } from 'apollo-server';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
//import { getUserId } from './utils.js';
import { connectDB } from './config/db.js';
import User from './models/users.js';
import Validation from "./validation/joi.schemas.js";
import * as Query from './resolvers/Query.js';
import * as Mutation from './resolvers/Mutation.js';
// import * as User from './resolvers/User.js';
// import * as Link from'./resolvers/Link.js';
// import * as Subscription from'./resolvers/Subscription.js';
// import * as Vote from'./resolvers/Vote.js';

// const pubsub = new PubSub();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resolvers = {
    Query,
    Mutation,
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
          user: User,
          validation: Validation,
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

