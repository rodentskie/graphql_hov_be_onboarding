import { SchemaDirectiveVisitor } from '@graphql-tools/utils';
import { Me } from '../types/accounts-types';
import {
  DirectiveLocation,
  GraphQLDirective,
  defaultFieldResolver,
} from 'graphql';
import { Context } from 'koa';

import { validateToken } from '../middlewares/validate-token';
class isPrivateDirective extends SchemaDirectiveVisitor {
  static getDirectiveDeclaration(directiveName = 'private') {
    return new GraphQLDirective({
      name: directiveName,
      locations: [DirectiveLocation.FIELD_DEFINITION, DirectiveLocation.OBJECT],
    });
  }

  visitFieldDefinition(field: any) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = (root: any, args: any, context: Context, info: any) => {
      const auth = context.request.header.authorization;
      const user = validateToken(auth) as Me;
      const data = user.data;
      data.id = Buffer.from(data.id);

      return resolve.call(this, root, args, { ...context, data }, info);
    };
  }

  visitObject(type: object) {
    console.log(type);
  }
}

export = isPrivateDirective;
