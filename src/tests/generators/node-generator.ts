import { commerce } from 'faker';
import { CreateProductInput } from '../../types/products-types';
import server from '../../index';
import request from 'supertest';
import { dummyAccount } from './account-generator';
import ProductModel from '../../models/products';
import { validateToken } from '../../middlewares/validate-token';
import { generateId, EntityType } from '../../functions/generate-binary-id';

const generateFakeProduct = () => {
  const name = commerce.product();
  const data: CreateProductInput = {
    input: {
      name,
      description: `${name} sample description.`,
    },
  };
  return data;
};

const getToken = async (): Promise<string> => {
  const signUpMutation = `
  mutation($input:SignUpInput!) {
      signUp(input: $input){
          token
      }
  }`;

  const data = dummyAccount();
  const res = await request(server)
    .post('/graphql')
    .send({
      query: signUpMutation,
      variables: {
        ...data,
      },
    });

  const token: string = res.body.data.signUp.token;
  return token;
};

const returnExistingProduct = async (token: string) => {
  const fakeProduct = generateFakeProduct();
  const user = validateToken(`Bearer ${token}`);
  const { data } = user as {
    data: {
      id: Buffer;
    };
  };

  const id = generateId(EntityType.Product);

  const userId = data.id;
  const cursor = Buffer.concat([
    Buffer.from(fakeProduct.input.name),
    Buffer.from(id),
  ]);

  const product = {
    id,
    ...fakeProduct.input,
    owner: userId,
    cursor,
  };

  const insert = await ProductModel.create(product);
  return insert.id;
};

const returnUserBinaryId = async (token: string) => {
  const user = validateToken(`Bearer ${token}`);
  const { data } = user as {
    data: {
      id: Buffer;
    };
  };

  const userId = data.id;
  return userId;
};

export {
  generateFakeProduct,
  getToken,
  returnExistingProduct,
  returnUserBinaryId,
};
