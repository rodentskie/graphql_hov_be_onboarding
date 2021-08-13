import { expect } from 'chai';
import {
  getToken,
  returnExistingProduct,
  returnUserBinaryId,
} from '../generators/node-generator';
import server from '../../index';
import request from 'supertest';

const nodeQuery = `
query($id:Binary!){
    node(id: $id){
        ... on Account{
            emailAddress,
            firstName,
            lastName
          }
          ... on Product{
            name,
            description
          }
    }
}
`;

let token: string = ``;
before(async () => {
  token = await getToken();
});

describe(`Node test suite.`, () => {
  it('Get product data.', async () => {
    const productId = await returnExistingProduct(token);
    const hexId = productId.toString('hex');

    const res = await request(server)
      .post('/graphql')
      .send({
        query: nodeQuery,
        variables: {
          id: hexId,
        },
      })
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.data.node).to.exist;
  });

  it('Get product data, ID is invalid.', async () => {
    const productId = await returnExistingProduct(token);
    const hexId = `error${productId.toString('hex')}`;

    const res = await request(server)
      .post('/graphql')
      .send({
        query: nodeQuery,
        variables: {
          id: hexId,
        },
      })
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.errors[0].message).to.equal('Invalid Id');
  });

  it('Get user data.', async () => {
    const userId = await returnUserBinaryId(token);

    const res = await request(server)
      .post('/graphql')
      .send({
        query: nodeQuery,
        variables: {
          id: userId,
        },
      })
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.data.node).to.exist;
  });

  it('Get user data, ID is invalid', async () => {
    const userId = await returnUserBinaryId(token);
    const hexId = userId.toString('hex');

    const res = await request(server)
      .post('/graphql')
      .send({
        query: nodeQuery,
        variables: {
          id: hexId,
        },
      })
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.errors[0].message).to.equal('Invalid Id');
  });
});
