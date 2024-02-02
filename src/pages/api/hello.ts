import fs from "fs";
import path from "path";
import solc from "solc";
import _ from "lodash";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  message: string;
};

const isRelativePath = (path: string) => {
  return path.startsWith(".");
};

const findFiles = (
  contractCode: string,
  importContextPath: string,
  imports: Array<{ path: string; content: string }> = []
): Array<{ path: string; content: string }> => {
  const fullImportsRegex = /import\s+(?:{.*?}\s+from\s+)?['"](.*?)['"];/g; // /import\s+['"](.*?)['"];/g;
  const newFullImports = contractCode.match(fullImportsRegex);

  if (!newFullImports) return [...imports];

  const newlyFoundImports = [];

  for (let i = 0; i < newFullImports.length; i++) {
    const importFullStatement = newFullImports[i];

    const importPathRegex = /import\s+(?:{.*?}\s+from\s+)?['"](.*?)['"]/;
    const importPathMatch = importFullStatement.match(importPathRegex);

    console.log("importPathMatch", importPathMatch);
    // if (!importPathMatch) continue;
    const importPath = importPathMatch[1];

    const isRelative = isRelativePath(importPath);
    const importContextPathWithoutSol = importContextPath.substring(
      0,
      importContextPath.lastIndexOf("/")
    );

    const resolvedPath = isRelative
      ? path.join(importContextPathWithoutSol, importPath)
      : importPath;

    const finalResolvedPath = path.join(
      process.cwd(),
      "node_modules",
      resolvedPath
    );

    imports.push({
      path: resolvedPath,
      content: fs.readFileSync(finalResolvedPath, "utf8"),
    });

    newlyFoundImports.push({
      path: resolvedPath,
      content: fs.readFileSync(finalResolvedPath, "utf8"),
    });
  }

  // return [...imports];

  return _.flatten([
    ...imports,
    ...newlyFoundImports.map((i) => {
      return findFiles(i.content, i.path, imports);
    }),
  ]);
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const name = req.body.name;
  const contract = req.body.contract;

  console.log(contract);

  console.log("111111");

  const finalInput = _.uniqBy(findFiles(contract, `${name}.sol`), "path");

  console.log("2222222");

  const finalInputObject = finalInput.reduce((acc, curr) => {
    return {
      ...acc,
      [curr.path]: {
        content: curr.content,
      },
    };
  }, {});

  console.log("333333");

  const input = {
    language: "Solidity",
    sources: {
      [`${name}.sol`]: {
        content: contract,
      },
      ...finalInputObject,

      //       'test.sol': {
      //         content: `
      // // SPDX-License-Identifier: MIT
      // pragma solidity ^0.8.21;
      // import "./hello.sol";
      // contract C {H h; constructor(uint256 in) {h = new H(in);} function f() public { } }
      // `
      //       },
      //       'hello.sol': {
      //         content: `
      // // SPDX-License-Identifier: MIT
      // pragma solidity ^0.8.21;
      // contract H { uint256 foo; constructor(uint256 _foo) {foo = _foo;} function g() public { } }
      // `
      // }
    },
    settings: {
      outputSelection: {
        "*": {
          "*": ["*"],
        },
      },
    },
  };

  console.log("4444444");

  console.log("input", JSON.stringify(input, undefined, 4));
  // solc.compile(JSON.stringify(input));

  // New syntax (supported from 0.5.12, mandatory from 0.6.0)

  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  console.log(output);

  console.log("555555");

  // console.log("output", JSON.stringify(output, undefined, 4));
  // res.status(200);

  console.log("666666");

  res.status(200).json({
    abi: output.contracts[`${name}.sol`][name].abi,
    bytecode: output.contracts[`${name}.sol`][name].evm.bytecode.object,
    input: input,
    output: output,
  });
}
