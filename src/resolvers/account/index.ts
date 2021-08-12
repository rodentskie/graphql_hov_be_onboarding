import { generateId, EntityType } from '../../functions/generate-binary-id';
import AccountModel from '../../models/accounts';
import { encrypt } from '../../functions/secure-data';
import { generateToken } from '../../functions/create-token';
import BinaryResolver from '../../schema/scalars/customs/binary-scalar';
import EmailAddressResolver from '../../schema/scalars/customs/email-scalar';
import { SignUpInput } from '../../types/accounts-types';
import { Context } from 'koa';

export const AccountResolver = {
  Binary: BinaryResolver,
  EmailAddress: EmailAddressResolver,

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
  Query: {
    me: (_: never, {}, ctx: Context): Account => {
      const data: Account = ctx.user.data;
      const user = {
        id: Buffer.from(data.id),
        firstName: data.firstName,
        lastName: data.lastName,
        emailAddress: data.emailAddress,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
      return user;
    },
  },
};
