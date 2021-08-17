import { validateToken } from "../../middlewares/validate-token";

const returnUserBinaryId = async (token: string) => {
  const user = validateToken(`Bearer ${token}`);
  const { data } = user as {
    data: {
      id: Buffer;
    };
  };

  const userId = data.id;
  return userId;
};

export { returnUserBinaryId };
