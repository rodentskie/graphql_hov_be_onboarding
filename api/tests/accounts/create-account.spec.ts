import { expect } from 'chai';
import request from 'supertest';
import { server } from '../../index';
import { dummyAccount } from '../generators/account-generator';
import AccountModel from '../../models/accounts';

const signUpMutation = `
    mutation($input:SignUpInput!) {
        signUp(input: $input){
            token
        }
    }`;

after(async () => {
  await AccountModel.deleteMany();
});

describe('Sign up account test suite.', () => {
  it('Successful sign up.', async () => {
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

    expect(res.body.data.signUp).to.have.property('token');
  });

  it('Sign up error no first name.', async () => {
    const data = dummyAccount();
    data.input.firstName = '';
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

    expect(res.body.errors[0].message).to.equal(
      'Account validation failed: firstName: Path `firstName` is required.',
    );
  });

  it('Sign up error no last name.', async () => {
    const data = dummyAccount();
    data.input.lastName = '';
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

    expect(res.body.errors[0].message).to.equal(
      'Account validation failed: lastName: Path `lastName` is required.',
    );
  });

  it('Sign up error no email.', async () => {
    const data = dummyAccount();
    data.input.emailAddress = '';
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

    expect(res.body.errors[0].message).to.equal(
      'Variable "$input" got invalid value "" at "input.emailAddress"; Expected type "EmailAddress". Invalid email address.',
    );
  });

  it('Sign up, not allow existing email.', async () => {
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
        query: signUpMutation,
        variables: {
          input: {
            ...data.input,
          },
        },
      });
    expect(res.body.errors[0].message).to.equal('Email address already used.');
  });
});
