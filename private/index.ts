import { SchemaDirectiveVisitor } from '@graphql-tools/utils';
import {
  DirectiveLocation,
  GraphQLDirective,
  defaultFieldResolver,
} from 'graphql';
import { Context } from 'koa';
import { AuthenticationError } from 'apollo-server-errors';
import { Me } from '../types/accounts-types';
import { validateToken } from '../middlewares/validate-token';

class IsPrivateDirective extends SchemaDirectiveVisitor {
  static getDirectiveDeclaration(directiveName = 'private') {
    return new GraphQLDirective({
      name: directiveName,
      locations: [DirectiveLocation.FIELD_DEFINITION, DirectiveLocation.OBJECT],
    });
  }

  visitFieldDefinition(fields: any = {}) {
    const field = fields;
    const { resolve = defaultFieldResolver } = field;
    field.resolve = (
      root: Record<string, unknown>,
      args: Record<string, unknown>,
      context: Context,
      info: Record<string, unknown>,
    ) => {
      const auth: string = context.request.header.authorization!;
      if (!auth)
        throw new AuthenticationError('Invalid authentication header.');
      const user = validateToken(auth) as Me;
      const { data } = user;
      data.id = Buffer.from(data.id);
      return resolve.call(this, root, args, { ...context, data }, info);
    };
  }

  visitObject(type: unknown) {
    console.log(type);
  }
}

export = IsPrivateDirective;
