import { gql } from "apollo-server-koa";
import { mutations } from "../mutations/index";
import { query } from "../queries/index";
import { scalars } from "../scalars/index";
import { types } from "../types/index";

export const typeDefs = gql`
  ${scalars}
  ${types}
  ${mutations}
  ${query}
`;
