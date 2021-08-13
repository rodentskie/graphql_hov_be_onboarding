import { UserInputError } from 'apollo-server-errors';
import r from 'ramda';
import { EntityType } from '../../functions/generate-binary-id';
import AccountModel from '../../models/accounts';
import ProductModel from '../../models/products';
import { Product } from '../../types/products-types';
import { Context } from 'koa';

export const NodeResolver = {
  Node: {
    __resolveType(root: { id: Buffer }) {
      const type: number = r.head(root.id as unknown as [number])!;
      return EntityType[type];
    },
  },
  Product: {
    owner: async (root: Product, _: unknown, _context: Context) =>
      AccountModel.findOne({ id: root.owner }),
  },
  Query: {
    node: async (_: never, params: { id: Buffer }) => {
      const type = r.head(params.id as unknown as [number]);

      if (type === EntityType.Account) {
        return AccountModel.findOne({ id: params.id });
      }

      if (type === EntityType.Product) {
        return ProductModel.findOne({ id: params.id });
      }

      throw new UserInputError('Invalid Id');
    },
  },
};
