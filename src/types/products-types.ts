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

export { CreateProductInput, Product, UpdateProductInput };
