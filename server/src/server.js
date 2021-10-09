import express from 'express';
const { ApolloServer } = require('apollo-server-express');
import { makeExecutableSchema } from '@graphql-tools/schema';
import typeDefs from "./typedefs";
import resolvers from "./resolvers";

const schema = makeExecutableSchema({ typeDefs, resolvers });

async function startApolloServer() {
  const app = express();
  const server = new ApolloServer({ schema });
  await server.start();

  server.applyMiddleware({ app });

  await new Promise(resolve => app.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  return { server, app };
}

const { server, app } = startApolloServer();