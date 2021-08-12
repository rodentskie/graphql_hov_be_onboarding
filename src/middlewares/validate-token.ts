import { verify } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import { AuthenticationError } from 'apollo-server-errors';

const PW: string = process.env.TOKEN_PW || `mfmsosjwpxwszyzknnktjdvwqjspsqpw`;

const validateToken = (auth: string = ``) => {
  const token = auth.split(' ');
  if (token.length == 0)
    throw new AuthenticationError('Invalid authentication header.');
  if (token[0].toLowerCase() !== 'bearer')
    throw new AuthenticationError('Invalid authentication header.');

  const userToken = token[1];

  const user = verify(userToken, PW);
  return user;
};

export { validateToken };
