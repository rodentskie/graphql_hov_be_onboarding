import { generateId, EntityType } from '../../functions/generate-binary-id';
import {
  CreateProductInput,
  DeleteProductInput,
} from '../../types/products-types';
import ProductModel from '../../models/products';
import { Context } from 'koa';
import { Account } from '../../types/accounts-types';
import { UserInputError } from 'apollo-server-errors';

export const ProductResolver = {
  Mutation: {
    createProduct: async (_: never, data: CreateProductInput, ctx: Context) => {
      const { input } = data;
      const { name, description } = input;
      const id = generateId(EntityType.Product);
      const cursor = Buffer.concat([Buffer.from(name), Buffer.from(id)]);

      const user: Account = ctx.data;

      const req = await ProductModel.create({
        id,
        name,
        description,
        owner: user.id,
        cursor,
      });

      const product = {
        id: req.id,
        name: req.name,
        description: req.description,
        owner: req.owner,
        createdAt: req.createdAt,
        updatedAt: req.updatedAt,
      };

      return product;
    },
    deleteProduct: async (
      _: never,
      data: DeleteProductInput,
      ctx: Context,
    ): Promise<Boolean> => {
      const user: Account = ctx.data;
      const { id } = data.input;

      let bool = false;

      const product = await ProductModel.findOne({
        id: id,
        owner: user.id,
      });

      if (!product) throw new UserInputError('Product not found.');

      const del = await ProductModel.findByIdAndDelete(product._id);
      if (del) bool = true;

      return bool;
    },
  },
};
