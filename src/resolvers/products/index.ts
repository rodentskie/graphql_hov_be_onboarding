import { generateId, EntityType } from '../../functions/generate-binary-id';
import {
  CreateProductInput,
  ProductQueryParams,
  LooseObject,
  Product,
} from '../../types/products-types';
import ProductModel from '../../models/products';
import { Context } from 'koa';
import { Account } from '../../types/accounts-types';
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

      if (product.length == 0) throw new Error(`No products found.`);
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
  },
};
