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

type DeleteProductInput = {
  input: {
    id: Buffer;
  };
};

export { CreateProductInput, Product, DeleteProductInput };
