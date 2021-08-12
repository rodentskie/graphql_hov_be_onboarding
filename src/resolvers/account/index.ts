import { generateId, EntityType } from '../../functions/generate-binary-id';
import AccountModel from '../../models/accounts';
import { encrypt, compareData } from '../../functions/secure-data';
import { generateToken } from '../../functions/create-token';
import { UserInputError } from 'apollo-server-errors';

import { SignUpInput, AuthenticateInput } from '../../types/accounts-types';

export const AccountResolver = {
  Mutation: {
    signUp: async (_: never, data: SignUpInput) => {
      const { input } = data;
      const { emailAddress, firstName, lastName, password } = input;
      const id = generateId(EntityType.Account);

      const emailExists = await AccountModel.exists({
        emailAddress,
      });

      if (emailExists) throw new UserInputError('Email address already used.');

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
    authenticate: async (_: never, data: AuthenticateInput) => {
      const { input } = data;
      const { emailAddress, password } = input;

      const accountData = await AccountModel.findOne({
        emailAddress,
      });

      if (!accountData) throw new UserInputError('Invalid credentials.');

      const isCorrectPassword = await compareData(
        password,
        accountData.password,
      );

      if (!isCorrectPassword) throw new UserInputError('Invalid credentials.');

      const token = generateToken(accountData);

      return { token };
    },
  },
};
