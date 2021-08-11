import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-koa';
import dotenv from 'dotenv';
import Koa from 'koa';
import { dbConn } from './data/index';
dotenv.config();

const app = new Koa();
const apolloServer = new ApolloServer({
  // schema: await buildSchema({
  //   resolvers: [HelloWorldResolver, Hobbies, PeopleResolver],
  // }),
  context: ({ ctx }) => {
    return ctx;
  },
});

dbConn();

apolloServer.start();
apolloServer.applyMiddleware({ app });

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(
    `🚀⚙️  Server ready at http://localhost:${port}${apolloServer.graphqlPath}`,
  );
});

export default server;
