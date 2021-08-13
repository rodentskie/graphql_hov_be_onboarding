import { expect } from 'chai';
import server from '../../index';
import request from 'supertest';
import { dummyAccount, getToken } from '../generators/account-generator';

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

const meQuery = `
  query{
      me{
          lastName
          firstName
          emailAddress
        }
  }
`;

let token: string = ``;
before(async () => {
  token = await getToken();
});

describe(`Account test suite.`, () => {
  it(`Successful sign up.`, async () => {
    const data = dummyAccount();
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

    expect(res.body.data.signUp.token).to.exist;
  });

  it(`Successful authenticate.`, async () => {
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

  it(`Authentication fail password invalid.`, async () => {
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

  it(`Authentication fail email invalid.`, async () => {
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

  it('Me should display my account data.', async () => {
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
