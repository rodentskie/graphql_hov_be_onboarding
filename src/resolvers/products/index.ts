import { generateId, EntityType } from '../../functions/generate-binary-id';
import {
  CreateProductInput,
  UpdateProductInput,
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
    updateProduct: async (_: never, data: UpdateProductInput, ctx: Context) => {
      const user: Account = ctx.data;
      const { input } = data;
      const { id, body } = input;
      const { name, description } = body;

      if (name === '') throw new UserInputError('Please enter product name.');
      if (description === '')
        throw new UserInputError('Please enter product description.');

      const product = await ProductModel.findOne({
        id: id,
        owner: user.id,
      });

      if (!product) throw new UserInputError('Product does not exist');

      const toUpdate: LooseObject = {
        ...body,
      };

      if (name) {
        const entityId = generateId(EntityType.Product);
        const cursor = Buffer.concat([
          Buffer.from(name),
          Buffer.from(entityId),
        ]);
        toUpdate.cursor = cursor;
      }

      return ProductModel.findByIdAndUpdate(product._id, toUpdate, {
        new: true,
      });
    },
  },
};
