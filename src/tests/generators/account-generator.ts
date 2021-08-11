import { internet, name } from 'faker';

interface SignUpInput {
  emailAddress?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
}

const dummyAccount = () => {
  const data: SignUpInput = {
    firstName: name.firstName(),
    lastName: name.lastName(),
    emailAddress: internet.email(),
    password: internet.password(),
  };

  return data;
};

export { dummyAccount };
