import { GraphQLScalarType } from 'graphql';

const EmailAddressResolver = new GraphQLScalarType({
  name: 'EmailAddress',
  description: 'Validate email address from client.',

  parseValue(value) {
    const re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const bool = re.test(value);
    if (!bool) throw new Error('Invalid email address.');
    return value;
  },
});

export default EmailAddressResolver;
