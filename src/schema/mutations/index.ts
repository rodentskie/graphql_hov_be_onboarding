import { gql } from 'apollo-server-koa';

export const mutations = gql`
  directive @private on OBJECT | FIELD_DEFINITION

  type Mutation {
    signUp(input: SignUpInput!): Authentication!

    authenticate(input: AuthenticateInput!): Authentication!

    createProduct(input: CreateProductInput!): Product! @private

    updateProduct(input: UpdateProductInput!): Product! @private

    deleteProduct(input: DeleteProductInput!): Boolean! @private
  }

  input SignUpInput {
    emailAddress: EmailAddress!
    firstname: String!
    lastname: String!
    password: String!
  }

  input AuthenticateInput {
    emailAddress: String!
    password: String!
  }

  input CreateProductInput {
    name: String!
    description: String!
  }

  input UpdateProductInput {
    id: Binary!
    body: UpdateProductBody!
  }

  input UpdateProductBody {
    name: String
    description: String
  }

  input DeleteProductInput {
    id: Binary!
  }
`;
