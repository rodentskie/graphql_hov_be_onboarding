export const HelloWorldResolver = {
  Query: {
    hello: (): string => {
      return `Hello World`;
    },
  },
};
