import { expect } from 'chai';
import {
  generateFakeProduct,
  getToken,
  returnExistingProduct,
} from '../generators/products-generator';
import server from '../../index';
import request from 'supertest';

const createProductMutation = `
            mutation($input:CreateProductInput!){
                createProduct(input: $input){
                    name,
                    description
                }
            }
        `;

const updateProductMutation = `
            mutation($input:UpdateProductInput!){
                updateProduct(input: $input){
                    id
                    name
                    description
                }
            }
        `;

const deleteProductMutation = `
            mutation($input:DeleteProductInput!){
                deleteProduct(input: $input)
            }
        `;

let token: string = ``;
before(async () => {
  token = await getToken();
});

describe(`Product test suite.`, () => {
  it(`Successful create product.`, async () => {
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

    expect(res.body.data.createProduct).to.exist;
  });

  it(`Create product error no product name.`, async () => {
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

  it(`Create product error no product description.`, async () => {
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

  it(`Create product error no token.`, async () => {
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

  it(`Successful update product.`, async () => {
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

    expect(res.body.data.updateProduct).to.exist;
  });

  it(`Update product different user.`, async () => {
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

  it(`Update product product ID doesn't exist.`, async () => {
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

  it(`Update product error no token.`, async () => {
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

  it(`Successful delete product.`, async () => {
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

  it(`Delete product no token.`, async () => {
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

  it(`Delete product different user.`, async () => {
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

  it(`Delete product, product ID doesn't exist.`, async () => {
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
