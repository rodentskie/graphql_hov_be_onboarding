import { generateId, EntityType } from '../../functions/generate-binary-id';
import AccountModel from '../../models/accounts';
import { encrypt } from '../../functions/secure-data';
import { generateToken } from '../../functions/create-token';

interface SignUpInput {
  input: {
    emailAddress: string;
    firstName: string;
    lastName: string;
    password: string;
  };
}

export const AccountResolver = {
  Mutation: {
    signUp: async (_: never, data: SignUpInput) => {
      const { input } = data;
      const { emailAddress, firstName, lastName, password } = input;
      const id = generateId(EntityType.Account);

      const emailExists = await AccountModel.exists({
        emailAddress,
      });

      if (emailExists) throw new Error('Email address already used.');

      const user = await AccountModel.create({
        id,
        firstName,
        lastName,
        emailAddress,
        password: await encrypt(password),
      });
      const token = generateToken(user);

      return { token };
    },
  },
};
