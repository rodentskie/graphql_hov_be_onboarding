import { hash, compare, genSalt } from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const encrypt = async (str: string) => {
  const salt = await genSalt(12);
  return hash(str, salt);
};

const compareData = async (data: string, hashed: string) => {
  return compare(data, hashed);
};

export { encrypt, compareData };
