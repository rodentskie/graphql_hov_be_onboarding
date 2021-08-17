import { LooseObject } from "../../types/products-types";
import {
  StringQueryOperatorInput,
  BinaryQueryOperatorInput,
} from "../../types/query-operator";

const covertToQueryFilter = (filter: LooseObject) => {
  let finalQuery: LooseObject = {};

  if (!filter) return finalQuery;

  if (filter.name) {
    const query: StringQueryOperatorInput = filter.name;

    if (query.ne) {
      finalQuery = {
        name: {
          $ne: query.ne,
        },
      };
    }

    if (query.eq) {
      finalQuery = {
        name: {
          $eq: query.eq,
        },
      };
    }

    if (query.in) {
      finalQuery = {
        name: {
          $in: query.in,
        },
      };
    }

    if (query.nin) {
      finalQuery = {
        name: {
          $nin: query.nin,
        },
      };
    }

    if (query.startsWith) {
      finalQuery = {
        name: {
          $regex: `^${query.startsWith}`,
          $options: "i",
        },
      };
    }

    if (query.contains) {
      finalQuery = {
        name: {
          $regex: query.contains,
          $options: "i",
        },
      };
    }
  }

  if (filter.id) {
    const query: BinaryQueryOperatorInput = filter.id;

    if (query.ne) {
      finalQuery = {
        id: {
          $ne: query.ne,
        },
      };
    }

    if (query.eq) {
      finalQuery = {
        id: {
          $eq: query.eq,
        },
      };
    }

    if (query.in) {
      finalQuery = {
        id: {
          $in: query.in,
        },
      };
    }

    if (query.nin) {
      finalQuery = {
        id: {
          $nin: query.nin,
        },
      };
    }
  }

  return finalQuery;
};

export { covertToQueryFilter };
