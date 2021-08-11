export const HelloWorldResolver = {
  Query: {
    hello: (): String => {
      return `Hello World`;
    },
  },
};
