import { commerce } from "faker";
import { CreateProductInput } from "../../types/products-types";
import ProductModel from "../../models/products";
import { validateToken } from "../../middlewares/validate-token";
import { generateId, EntityType } from "../../functions/generate-binary-id";

const generateFakeProduct = () => {
  const name = commerce.product();
  const data: CreateProductInput = {
    input: {
      name,
      description: `${name} sample description.`,
    },
  };
  return data;
};

const returnExistingProduct = async (token: string) => {
  const fakeProduct = generateFakeProduct();
  const user = validateToken(`Bearer ${token}`);
  const { data } = user as {
    data: {
      id: Buffer;
    };
  };

  const id = generateId(EntityType.Product);

  const userId = data.id;
  const cursor = Buffer.concat([
    Buffer.from(fakeProduct.input.name),
    Buffer.from(id),
  ]);

  await ProductModel.create({
    id,
    ...fakeProduct.input,
    owner: userId,
    cursor,
  });

  return id;
};

export { generateFakeProduct, returnExistingProduct };
