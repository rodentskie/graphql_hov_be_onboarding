import { expect } from 'chai';
import request from 'supertest';
import { generateFakeProduct } from '../generators/products-generator';
import { server } from '../../index';
import { getToken } from '../generators/account-generator';
import ProductModel from '../../models/products';

const createProductMutation = `
            mutation($input:CreateProductInput!){
                createProduct(input: $input){
                    name,
                    description
                }
            }
        `;

after(async () => {
  await ProductModel.deleteMany();
});

describe('Create product test suite.', () => {
  it('Successful create product.', async () => {
    const token = await getToken();
    const data = generateFakeProduct();
    const res = await request(server)
      .post('/graphql')
      .send({
        query: createProductMutation,
        variables: {
          ...data,
        },
      })
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.data).to.have.property('createProduct');
  });

  it('Create product error no product name.', async () => {
    const token = await getToken();
    const data = generateFakeProduct();
    const res = await request(server)
      .post('/graphql')
      .send({
        query: createProductMutation,
        variables: {
          input: {
            name: '',
            description: data.input.description,
          },
        },
      })
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.errors[0].message).to.equal(
      'Product validation failed: name: Path `name` is required.',
    );
  });

  it('Create product error no product description.', async () => {
    const token = await getToken();
    const data = generateFakeProduct();
    const res = await request(server)
      .post('/graphql')
      .send({
        query: createProductMutation,
        variables: {
          input: {
            name: data.input.name,
            description: '',
          },
        },
      })
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.errors[0].message).to.equal(
      'Product validation failed: description: Path `description` is required.',
    );
  });

  it('Create product error no token.', async () => {
    const data = generateFakeProduct();
    const res = await request(server)
      .post('/graphql')
      .send({
        query: createProductMutation,
        variables: {
          ...data,
        },
      });

    expect(res.body.errors[0].message).to.equal(
      'Invalid authentication header.',
    );
  });
});
