import BinaryResolver from "../../schema/scalars/customs/binary-scalar";
import EmailAddressResolver from "../../schema/scalars/customs/email-scalar";

export const ScalarResolver = {
  Binary: BinaryResolver,
  EmailAddress: EmailAddressResolver,
};
