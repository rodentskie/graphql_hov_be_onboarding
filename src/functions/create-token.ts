import { sign } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const PW: string = process.env.TOKEN_PW || `mfmsosjwpxwszyzknnktjdvwqjspsqpw`;

const generateToken = (data: Object) => {
  const token: string = sign({ data }, PW);
  return token;
};

export { generateToken };
