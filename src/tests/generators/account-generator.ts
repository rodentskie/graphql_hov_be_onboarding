import { internet, name } from 'faker';
import { SignUpInput } from '../../types/accounts-types';
import server from '../../index';
import request from 'supertest';

const dummyAccount = () => {
  const data: SignUpInput = {
    input: {
      firstName: name.firstName(),
      lastName: name.lastName(),
      emailAddress: internet.email(),
      password: internet.password(),
    },
  };

  return data;
};

const getToken = async (): Promise<string> => {
  const signUpMutation = `
  mutation($input:SignUpInput!) {
      signUp(input: $input){
          token
      }
  }`;

  const data = dummyAccount();
  const res = await request(server)
    .post('/graphql')
    .send({
      query: signUpMutation,
      variables: {
        ...data,
      },
    });

  const token: string = res.body.data.signUp.token;
  return token;
};

export { dummyAccount, getToken };
