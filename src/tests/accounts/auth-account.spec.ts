import { expect } from 'chai';
import server from '../../index';
import request from 'supertest';
import { dummyAccount } from '../generators/account-generator';

const signUpMutation = `
    mutation($input:SignUpInput!) {
        signUp(input: $input){
            token
        }
    }`;

const authenticatepMutation = `
      mutation($input:AuthenticateInput!){
        authenticate(input: $input){
              token
          }
      }
  `;

describe(`Authenticate account test suite.`, () => {
  it('Successful authenticate.', async () => {
    const data = dummyAccount();
    await request(server)
      .post('/graphql')
      .send({
        query: signUpMutation,
        variables: {
          input: {
            ...data.input,
          },
        },
      });

    const res = await request(server)
      .post('/graphql')
      .send({
        query: authenticatepMutation,
        variables: {
          input: {
            emailAddress: data.input.emailAddress,
            password: data.input.password,
          },
        },
      });

    expect(res.body.data.authenticate.token).to.exist;
  });

  it('Authentication fail password invalid.', async () => {
    const data = dummyAccount();

    await request(server)
      .post('/graphql')
      .send({
        query: signUpMutation,
        variables: {
          input: {
            ...data.input,
          },
        },
      });

    const res = await request(server)
      .post('/graphql')
      .send({
        query: authenticatepMutation,
        variables: {
          input: {
            emailAddress: data.input.emailAddress,
            password: `${data.input.password}error`,
          },
        },
      });
    expect(res.body.errors[0].message).to.equal('Invalid credentials.');
  });

  it('Authentication fail email invalid.', async () => {
    const data = dummyAccount();

    await request(server)
      .post('/graphql')
      .send({
        query: signUpMutation,
        variables: {
          input: {
            ...data.input,
          },
        },
      });

    const res = await request(server)
      .post('/graphql')
      .send({
        query: authenticatepMutation,
        variables: {
          input: {
            emailAddress: `${data.input.emailAddress}error`,
            password: data.input.password,
          },
        },
      });
    expect(res.body.errors[0].message).to.equal('Invalid credentials.');
  });
});
