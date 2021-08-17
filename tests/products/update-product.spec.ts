import { expect } from 'chai';
import request from 'supertest';
import {
  generateFakeProduct,
  returnExistingProduct,
} from '../generators/products-generator';
import server from '../../index';
import { getToken } from '../generators/account-generator';

const updateProductMutation = `
            mutation($input:UpdateProductInput!){
                updateProduct(input: $input){
                    id
                    name
                    description
                }
            }
        `;

describe('Update product test suite.', () => {
  it('Successful update product.', async () => {
    const token = await getToken();
    const productId = await returnExistingProduct(token);
    const hexId = productId.toString('hex');
    const data = generateFakeProduct();

    const res = await request(server)
      .post('/graphql')
      .send({
        query: updateProductMutation,
        variables: {
          input: {
            id: hexId,
            body: {
              ...data.input,
            },
          },
        },
      })
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.data).to.have.property('updateProduct');
  });

  it('Update product different user.', async () => {
    const token = await getToken();
    const productId = await returnExistingProduct(token);
    const hexId = productId.toString('hex');
    const data = generateFakeProduct();

    const otherToken = await getToken();

    const res = await request(server)
      .post('/graphql')
      .send({
        query: updateProductMutation,
        variables: {
          input: {
            id: hexId,
            body: {
              ...data.input,
            },
          },
        },
      })
      .set('Authorization', `Bearer ${otherToken}`);

    expect(res.body.errors[0].message).to.equal('Product does not exist');
  });

  it("Update product product ID doesn't exist.", async () => {
    const token = await getToken();
    const productId = await returnExistingProduct(token);
    const hexId = `${productId.toString('hex')}error`;
    const data = generateFakeProduct();

    const otherToken = await getToken();

    const res = await request(server)
      .post('/graphql')
      .send({
        query: updateProductMutation,
        variables: {
          input: {
            id: hexId,
            body: {
              ...data.input,
            },
          },
        },
      })
      .set('Authorization', `Bearer ${otherToken}`);

    expect(res.body.errors[0].message).to.equal('Product does not exist');
  });

  it('Update product error no token.', async () => {
    const token = await getToken();
    const productId = await returnExistingProduct(token);
    const hexId = productId.toString('hex');
    const data = generateFakeProduct();

    const res = await request(server)
      .post('/graphql')
      .send({
        query: updateProductMutation,
        variables: {
          input: {
            id: hexId,
            body: {
              ...data.input,
            },
          },
        },
      });
    expect(res.body.errors[0].message).to.equal(
      'Invalid authentication header.',
    );
  });
});
