import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-koa';
import dotenv from 'dotenv';
import Koa from 'koa';
import { dbConn } from './data/index';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDefs } from './schema/typeDefs/index';
import {
  HelloWorldResolver,
  AccountResolver,
  ProductResolver,
} from './resolvers/index';
dotenv.config();
import isPrivateDirective from './private/index';

const app = new Koa();

const apolloServer = new ApolloServer({
  schema: makeExecutableSchema({
    typeDefs,
    resolvers: [ProductResolver, HelloWorldResolver, AccountResolver],
    schemaDirectives: {
      private: isPrivateDirective,
    },
  }),
  context: ({ ctx }) => {
    return ctx;
  },
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
