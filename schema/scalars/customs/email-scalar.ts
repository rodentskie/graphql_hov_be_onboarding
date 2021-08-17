import { GraphQLScalarType } from 'graphql';

const EmailAddressResolver = new GraphQLScalarType({
  name: 'EmailAddress',
  description: 'Validate email address from client.',

  parseValue(value) {
    const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    const bool = re.test(value);
    if (!bool) throw new Error('Invalid email address.');
    return value;
  },
});

export default EmailAddressResolver;
