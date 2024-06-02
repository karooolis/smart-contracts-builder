import _ from "lodash";
import solc from "solc";
import { findFiles } from "./findFiles";

export const compile = (name: string, contract: string) => {
  const finalInput = _.uniqBy(findFiles(contract, `${name}.sol`), "path");
  const finalInputObject = finalInput.reduce((acc, curr) => {
    return {
      ...acc,
      [curr.path]: {
        content: curr.content,
      },
    };
  }, {});

  const input = {
    language: "Solidity",
    sources: {
      [`${name}.sol`]: {
        content: contract,
      },
      ...finalInputObject,
    },
    settings: {
      outputSelection: {
        "*": {
          "*": ["*"],
        },
      },
    },
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));

  return {
    input,
    output,
  };
};
