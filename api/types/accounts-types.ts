type SignUpInput = {
  input: {
    emailAddress: string;
    firstName: string;
    lastName: string;
    password: string;
  };
};

type AuthenticateInput = {
  input: {
    emailAddress: string;
    password: string;
  };
};

type Account = {
  id: Buffer;
  firstName: string;
  lastName: string;
  emailAddress: string;
  createdAt: Date;
  updatedAt: Date;
};

type Me = {
  data: {
    id: Buffer;
    firstName: string;
    lastName: string;
    emailAddress: string;
    createdAt: Date;
    updatedAt: Date;
  };
};

interface PrivateContext {
  data: Account;
}

export {
  SignUpInput, AuthenticateInput, Account, Me, PrivateContext,
};
