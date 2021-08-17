type BinaryQueryOperatorInput = {
  eq?: Buffer;
  ne?: Buffer;
  in?: [Buffer];
  nin?: [Buffer];
};
type StringQueryOperatorInput = {
  eq?: string;
  ne?: string;
  in?: [string];
  nin?: [string];
  startsWith?: string;
  contains?: string;
};

export { StringQueryOperatorInput, BinaryQueryOperatorInput };
