import { generateId, EntityType } from '../../functions/generate-binary-id';
import BinaryResolver from '../../schema/scalars/customs/binary-scalar';
import { CreateProductInput } from '../../types/products-types';
import ProductModel from '../../models/products';
import { Context } from 'koa';
import { Account } from '../../types/accounts-types';

export const ProductResolver = {
  Binary: BinaryResolver,

  Mutation: {
    createProduct: async (_: never, data: CreateProductInput, ctx: Context) => {
      const { input } = data;
      const { name, description } = input;
      const id = generateId(EntityType.Product);
      const cursor = Buffer.concat([Buffer.from(name), Buffer.from(id)]);

      const user: Account = ctx.user.data;
      const userId = user.id;
      const { firstName, lastName, emailAddress, createdAt, updatedAt } = user;
      const owner = Buffer.from(userId);

      const req = await ProductModel.create({
        id,
        name,
        description,
        owner,
        cursor,
      });

      const product = {
        id: req.id,
        name: req.name,
        description: req.description,
        createdAt: req.createdAt,
        updatedAt: req.updatedAt,
        owner: {
          id: owner,
          firstName,
          lastName,
          emailAddress,
          createdAt,
          updatedAt,
        },
      };
      return product;
    },
  },
};
