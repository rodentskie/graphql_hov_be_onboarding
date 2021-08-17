import { gql } from "apollo-server-koa";

export const query = gql`
  type Query {
    node(id: Binary!): Node!

    hello: String

    me: Account! @private

    products(
      first: Int = 10
      after: Binary
      filter: ProductsFilter
      sort: ProductSortInput
    ): ProductConnection!
  }

  input ProductsFilter {
    id: BinaryQueryOperatorInput
    name: StringQueryOperatorInput
  }

  input ProductSortInput {
    name: Int
  }

  input BinaryQueryOperatorInput {
    eq: Binary
    ne: Binary
    in: [Binary!]
    nin: [Binary!]
  }

  input StringQueryOperatorInput {
    eq: String
    ne: String
    in: [String!]
    nin: [String!]
    startsWith: String
    contains: String
  }

  type ProductConnection {
    edges: [ProductEdge!]!
    pageInfo: PageInfo!
  }

  type PageInfo {
    hasNextPage: Boolean!
    endCursor: Binary
  }

  type ProductEdge {
    cursor: Binary!
    node: Product!
  }
`;
