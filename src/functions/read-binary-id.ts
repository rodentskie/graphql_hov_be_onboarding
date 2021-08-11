import { GraphQLScalarType } from 'graphql';

const BinaryResolver = new GraphQLScalarType({
  name: 'Binary',
  description: 'String representation of a Buffer ID.',

  serialize(value) {
    if (!(value instanceof Buffer)) {
      throw new Error('Invalid return type for Binary');
    }
    return value.toString('hex');
  },

  parseValue(value) {
    return Buffer.from(value, 'hex');
  },

  parseLiteral(ast: any) {
    return Buffer.from(ast.value, 'hex');
  },
});

export default BinaryResolver;
