import { Context } from 'koa';
import { verify } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const PW: string = process.env.TOKEN_PW || `mfmsosjwpxwszyzknnktjdvwqjspsqpw`;

const validateToken = async (ctx: Context, next: Function) => {
  const { authorization } = ctx.headers;
  if (!authorization) ctx.throw(403, `Forbidden`);

  const token = authorization.split(' ');
  if (token.length == 0) ctx.throw(403, `Forbidden`);
  if (token[0].toLowerCase() !== 'bearer') ctx.throw(403, `Forbidden`);

  const myToken = token[1];

  const user = verify(myToken, PW);
  ctx.user = user;
  return next();
};

export { validateToken };
