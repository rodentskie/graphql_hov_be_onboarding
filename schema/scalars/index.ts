import { gql } from "apollo-server-koa";

export const scalars = gql`
  scalar Binary
  scalar EmailAddress
  scalar DateTime
`;
