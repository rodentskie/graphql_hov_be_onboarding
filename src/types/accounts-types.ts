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
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

export { SignUpInput, AuthenticateInput, Account };
