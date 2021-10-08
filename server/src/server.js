import { makeExecutableSchema } from 'graphql-tools';
import { graphql } from 'graphql';
import express from 'express';
import { graphiqlExpress, graphqlExpress } from "apollo-server-express";
import cors from 'cors';
import bodyParser from 'body-parser';
import typeDefs from "./typedefs";
import resolvers from "./resolvers";

const schema = makeExecutableSchema({ typeDefs, resolvers });

const query = process.argv[2];

graphql(schema, query).then(result => {
  console.log(JSON.stringify(result, null, 2));
});

const app = express();
app.use(cors());
app.use('/graphql', bodyParser.json(), graphqlExpress({schema}));
app.use('/graphiql', graphiqlExpress({endpointURL: '/graphql'}))
app.listen(4000, () => {
  console.log( 'go to http://localhost:4000/graphiql to run queries')
})
