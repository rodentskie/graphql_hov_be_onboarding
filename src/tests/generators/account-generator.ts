import { internet, name } from 'faker';
import { SignUpInput } from '../../types/accounts-types';

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

export { dummyAccount };
