/* eslint-disable @typescript-eslint/no-explicit-any */

import sls from "serverless-http";
import { app } from "./index";

const handler = sls(app);

const hello = async (event: any, context: any) => {
  const result = await handler(event, context);
  return result;
};

export { hello };
