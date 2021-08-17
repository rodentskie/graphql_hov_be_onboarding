import { expect } from 'chai';
import { returnExistingProduct } from '../generators/products-generator';
import server from '../../index';
import request from 'supertest';
import { getToken } from '../generators/account-generator';

const deleteProductMutation = `
            mutation($input:DeleteProductInput!){
                deleteProduct(input: $input)
            }
        `;

describe('Delete product test suite.', () => {
  it('Successful delete product.', async () => {
    const token = await getToken();
    const productId = await returnExistingProduct(token);
    const hexId = productId.toString('hex');

    const res = await request(server)
      .post('/graphql')
      .send({
        query: deleteProductMutation,
        variables: {
          input: {
            id: hexId,
          },
        },
      })
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.data.deleteProduct).to.exist;
  });

  it('Delete product no token.', async () => {
    const token = await getToken();
    const productId = await returnExistingProduct(token);
    const hexId = productId.toString('hex');

    const res = await request(server)
      .post('/graphql')
      .send({
        query: deleteProductMutation,
        variables: {
          input: {
            id: hexId,
          },
        },
      });

    expect(res.body.errors[0].message).to.equal(
      'Invalid authentication header.',
    );
  });

  it('Delete product different user.', async () => {
    const token = await getToken();
    const productId = await returnExistingProduct(token);
    const hexId = productId.toString('hex');

    const otherToken = await getToken();

    const res = await request(server)
      .post('/graphql')
      .send({
        query: deleteProductMutation,
        variables: {
          input: {
            id: hexId,
          },
        },
      })
      .set('Authorization', `Bearer ${otherToken}`);

    expect(res.body.errors[0].message).to.equal('Product not found.');
  });

  it("Delete product, product ID doesn't exist.", async () => {
    const token = await getToken();
    const productId = await returnExistingProduct(token);
    const hexId = `error${productId.toString('hex')}`;

    const res = await request(server)
      .post('/graphql')
      .send({
        query: deleteProductMutation,
        variables: {
          input: {
            id: hexId,
          },
        },
      })
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.errors[0].message).to.equal('Product not found.');
  });
});
