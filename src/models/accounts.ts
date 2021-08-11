import { Schema, model } from 'mongoose';

interface Account {
  id: Buffer;
  firstName: string;
  lastName: string;
  emailAddress: string;
  password: string;
}

const schema = new Schema<Account>(
  {
    id: { type: Buffer, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    emailAddress: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const AccountModel = model<Account>('Account', schema);

export default AccountModel;
