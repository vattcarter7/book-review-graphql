import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import typeDefs from './typedefs';
import { resolvers } from './resolvers';
import loaders from './utils/loaders';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context(request) {
    return {
      loaders: loaders(),
      request
    };
  }
});

const app = express();

server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
