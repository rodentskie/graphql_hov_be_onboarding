import { expect } from 'chai';
import request from 'supertest';
import server from '../../index';
import { getToken } from '../generators/account-generator';

const meQuery = `
  query{
      me{
          lastName
          firstName
          emailAddress
        }
  }
`;

describe(`Me account test suite.`, () => {
  it('Me should display my account data.', async () => {
    const token = await getToken();
    const res = await request(server)
      .post('/graphql')
      .send({
        query: meQuery,
      })
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.data.me).to.exist;
  });

  it('Me error no token.', async () => {
    const res = await request(server).post('/graphql').send({
      query: meQuery,
    });

    expect(res.body.errors[0].message).to.equal(
      'Invalid authentication header.',
    );
  });
});
