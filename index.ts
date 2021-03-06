import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-koa';
import dotenv from 'dotenv';
import Koa from 'koa';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { dbConn } from './data/index';
import { typeDefs } from './schema/typeDefs/index';
import {
  HelloWorldResolver,
  AccountResolver,
  ProductResolver,
  ScalarResolver,
  NodeResolver,
} from './resolvers/index';
import IsPrivateDirective from './private/index';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';

dotenv.config();

const app = new Koa();

const apolloServer = new ApolloServer({
  schema: makeExecutableSchema({
    typeDefs,
    resolvers: [
      ProductResolver,
      HelloWorldResolver,
      AccountResolver,
      ScalarResolver,
      NodeResolver,
    ],
    schemaDirectives: {
      private: IsPrivateDirective,
    },
  }),
  context: ({ ctx }) => ctx,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
});

(async () => {
  await dbConn();

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
})();

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(
    `🚀⚙️  Server ready at http://localhost:${port}${apolloServer.graphqlPath}`,
  );
});

export default server;
// trigger
