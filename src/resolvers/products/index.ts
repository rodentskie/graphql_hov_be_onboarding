import { generateId, EntityType } from '../../functions/generate-binary-id';
import {
  CreateProductInput,
  DeleteProductInput,
  UpdateProductInput,
  ProductQueryParams,
  LooseObject,
  Product,
} from '../../types/products-types';
import ProductModel from '../../models/products';
import { Context } from 'koa';
import { Account } from '../../types/accounts-types';
import { UserInputError } from 'apollo-server-errors';
import r from 'ramda';
import { covertToQueryFilter } from '../helpers/convert-to-query';

export const ProductResolver = {
  Query: {
    products: async (_: never, data: ProductQueryParams, ctx: Context) => {
      let {
        first = 5,
        after,
        filter,
        sort = {
          name: 1,
        },
      } = data;
      let product: Array<Product> = [];
      let finalData: LooseObject = {};

      const options: LooseObject = {
        limit: parseInt(first.toString()),
        sort,
      };

      options.sort.name = options.sort.name == 1 ? `asc` : `desc`;
      const queryFilter = covertToQueryFilter(filter);

      if (!after) {
        options.sort['createdAt'] = `asc`;
        product = await ProductModel.find({}, null, options).where(
          queryFilter!,
        );
      }

      if (after) {
        product = await ProductModel.find(
          {
            cursor: { $gte: after },
          },
          null,
          options,
        ).where(queryFilter!);
      }
      if (product.length == 0) {
        return {
          edges: [],
          pageInfo: {
            hasNextPage: false,
            endCursor: null,
          },
        };
      }
      const endCursor = r.last(product)!.cursor;
      const hasNextPage = await ProductModel.exists({
        cursor: { $gt: endCursor },
      });

      finalData = {
        edges: r.map(
          (data) => ({
            node: data,
            cursor: data.cursor,
          }),
          product,
        ),
        pageInfo: {
          hasNextPage,
          endCursor,
        },
      };

      return finalData;
    },
  },
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
