import { connect } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbConn = () => {
  const uri: string =
    process.env.MONGO_URI || "mongodb://localhost/onboarding_graphql_test";

  const db = connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });

  return db;
};

export { dbConn };
