import { expect } from "chai";
import request from "supertest";
import { returnUserBinaryId } from "../generators/node-generator";
import server from "../../index";
import { getToken } from "../generators/account-generator";
import { returnExistingProduct } from "../generators/products-generator";
import AccountModel from "../../models/accounts";
import ProductModel from "../../models/products";

const nodeQuery = `
query($id:Binary!){
    node(id: $id){
        ... on Account{
            emailAddress,
            firstName,
            lastName
          }
          ... on Product{
            name,
            description
          }
    }
}
`;

after(async () => {
  await AccountModel.deleteMany();
  await ProductModel.deleteMany();
});

describe("Node test suite.", () => {
  it("Get product data.", async () => {
    const token = await getToken();
    const productId = await returnExistingProduct(token);
    const hexId = productId.toString("hex");

    const res = await request(server)
      .post("/graphql")
      .send({
        query: nodeQuery,
        variables: {
          id: hexId,
        },
      })
      .set("Authorization", `Bearer ${token}`);

    expect(res.body.data).to.have.property("node");
  });

  it("Get product data, ID is invalid.", async () => {
    const token = await getToken();
    const productId = await returnExistingProduct(token);
    const hexId = `error${productId.toString("hex")}`;

    const res = await request(server)
      .post("/graphql")
      .send({
        query: nodeQuery,
        variables: {
          id: hexId,
        },
      })
      .set("Authorization", `Bearer ${token}`);

    expect(res.body.errors[0].message).to.equal("Invalid Id");
  });

  it("Get user data.", async () => {
    const token = await getToken();
    const userId = await returnUserBinaryId(token);

    const res = await request(server)
      .post("/graphql")
      .send({
        query: nodeQuery,
        variables: {
          id: userId,
        },
      })
      .set("Authorization", `Bearer ${token}`);

    expect(res.body.data).to.have.property("node");
  });

  it("Get user data, ID is invalid", async () => {
    const token = await getToken();
    const userId = await returnUserBinaryId(token);
    const hexId = userId.toString("hex");

    const res = await request(server)
      .post("/graphql")
      .send({
        query: nodeQuery,
        variables: {
          id: hexId,
        },
      })
      .set("Authorization", `Bearer ${token}`);

    expect(res.body.errors[0].message).to.equal("Invalid Id");
  });
});
