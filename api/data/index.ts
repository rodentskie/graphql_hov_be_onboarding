import { connect } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbConn = async () => {
  const uri: string =
    process.env.MONGO_URI ||
    "mongodb://localhost:27017/onboarding_graphql_test?authSource=admin";

  await connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
};

export { dbConn };
