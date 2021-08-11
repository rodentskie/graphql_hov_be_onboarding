import { expect } from 'chai';
import server from '../../index';
import Request from 'supertest';
import { dummyAccount } from '../generators/account-generator';

describe(`Account test suite.`, () => {
  it(`Successful sign up.`, async () => {
    const input = dummyAccount();
    const signUpMutation = `
    mutation($input:SignUpInput!) {
        signUp(input: $input){
            token
        }
    }`;

    const res = await Request(server).post('/graphql').send({
      query: signUpMutation,
      variables: {
        input,
      },
    });

    expect(res.statusCode).to.equal(200);
  });
});
