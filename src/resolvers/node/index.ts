import { UserInputError } from 'apollo-server-errors';
import r from 'ramda';
import { EntityType } from '../../functions/generate-binary-id';
import AccountModel from '../../models/accounts';
import { Account } from '../../types/accounts-types';
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
    owner: async (root: Product, _: unknown, _context: Context) => {
      const data = await AccountModel.findOne({ id: root.owner })!;
      const user = data as Account;
      return user;
    },
  },
  Query: {
    node: async (_: never, params: { id: Buffer }) => {
      const type = r.head(params.id as unknown as [number]);

      if (type === EntityType.Account) {
        const data = await AccountModel.findOne({ id: params.id });
        const user = data as Account;
        return user;
      }

      if (type === EntityType.Product) {
        const data = await ProductModel.findOne({ id: params.id });
        const product = data as Product;
        return product;
      }

      throw new UserInputError('Invalid Id');
    },
  },
};
