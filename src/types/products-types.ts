import {
  StringQueryOperatorInput,
  BinaryQueryOperatorInput,
} from './query-operator';

type CreateProductInput = {
  input: {
    name: string;
    description: string;
  };
};

interface Product {
  id: Buffer;
  name: string;
  description: string;
  owner: Buffer;
  cursor: Buffer;
  createdAt: Date;
  updatedAt: Date;
}

type UpdateProductInput = {
  input: {
    id: Buffer;
    body: {
      name: string;
      description: string;
    };
  };
};

type ProductQueryParams = {
  first: number;
  after: Buffer;
  filter: {
    id: BinaryQueryOperatorInput;
    name: StringQueryOperatorInput;
  };
  sort: {
    name: number | string;
  };
};

interface LooseObject {
  [key: string]: any;
}

export { CreateProductInput, Product, ProductQueryParams, LooseObject, UpdateProductInput };

