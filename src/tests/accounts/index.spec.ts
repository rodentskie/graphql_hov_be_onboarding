import { expect } from 'chai';
import server from '../../index';
import request from 'supertest';
import { dummyAccount } from '../generators/account-generator';

describe(`Account test suite.`, () => {
  it(`Successful sign up.`, async () => {
    const data = dummyAccount();
    const signUpMutation = `
    mutation($input:SignUpInput!) {
        signUp(input: $input){
            token
        }
    }`;

    const res = await request(server)
      .post('/graphql')
      .send({
        query: signUpMutation,
        variables: {
          input: {
            ...data.input,
          },
        },
      });

    expect(res.statusCode).to.equal(200);
  });
});
