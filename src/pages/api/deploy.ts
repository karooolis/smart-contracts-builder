import solc from "solc";
import _ from "lodash";
import type { NextApiRequest, NextApiResponse } from "next";
import { findFiles } from "./helpers/findFiles";

// TODO: add proper output types
type ResponseData = {
  abi: any;
  bytecode: any;
  input: any;
  output: any;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const name = req.body.name;
  const contract = req.body.contract;
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

  res.status(200).json({
    abi: output.contracts[`${name}.sol`][name].abi,
    bytecode: output.contracts[`${name}.sol`][name].evm.bytecode.object,
    input: input,
    output: output,
  });
}
