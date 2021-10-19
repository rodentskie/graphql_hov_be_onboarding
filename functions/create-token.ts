import { sign } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Account } from '../types/accounts-types';

dotenv.config();
const PW: string = process.env.TOKEN_PW || 'mfmsosjwpxwszyzknnktjdvwqjspsqpw';

const generateToken = (data: Account) => {
  const token: string = sign({ data }, PW);
  return token;
};

export { generateToken };
