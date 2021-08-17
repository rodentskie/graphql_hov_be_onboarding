import { Context } from 'koa';
import { UserInputError } from 'apollo-server-errors';
import r from 'ramda';
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
import { Account } from '../../types/accounts-types';
import { covertToQueryFilter } from '../helpers/convert-to-query';

export const ProductResolver = {
  Query: {
    products: async (_: never, data: ProductQueryParams) => {
      const {
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
        limit: first ? Number(first) : 5,
        sort,
      };

      if (options.sort)
        options.sort.name = options.sort.name === 1 ? `asc` : `desc`;

      const queryFilter = covertToQueryFilter(filter);

      if (!after) {
        if (!options.sort) options.sort = {};
        options.sort.createdAt = `asc`;
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
      if (product.length === 0) {
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
          (item) => ({
            node: item,
            cursor: item.cursor,
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
    ): Promise<boolean> => {
      const user: Account = ctx.data;

      const { id } = data.input;

      let bool = false;

      const product = await ProductModel.findOne({
        id,
        owner: user.id,
      });

      if (!product) throw new UserInputError('Product not found.');

      const del = await product.remove();
      if (del) bool = true;

      return bool;
    },
    updateProduct: async (
      _: never,
      data: UpdateProductInput,
      ctx: Context,
    ): Promise<Product | null> => {
      const user: Account = ctx.data;
      const { input } = data;
      const { id, body } = input;
      const { name, description } = body;

      if (name === '') throw new UserInputError('Please enter product name.');
      if (description === '')
        throw new UserInputError('Please enter product description.');

      const product = await ProductModel.findOne({
        id,
        owner: user.id,
      });

      if (!product) throw new UserInputError('Product does not exist');

      if (name) {
        const entityId = generateId(EntityType.Product);
        const cursor = Buffer.concat([
          Buffer.from(name),
          Buffer.from(entityId),
        ]);
        product.name = name;
        product.cursor = cursor;
      }

      if (description) {
        product.description = description;
      }

      const update = await product.save();
      return update;
    },
  },
};
