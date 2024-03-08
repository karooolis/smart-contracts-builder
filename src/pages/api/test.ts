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
  const fullImportsRegex = /import\s+['"](.*?)['"];/g;
  const newFullImports = contractCode.match(fullImportsRegex);

  if (!newFullImports) return [...imports];

  const newlyFoundImports = [];

  for (let i = 0; i < newFullImports.length; i++) {
    const importFullStatement = newFullImports[i];

    const importPathRegex = /import\s+"(.*?)";/;
    const importPathMatch = importFullStatement.match(importPathRegex);
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

// export default function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<ResponseData>
// ) {
const erc20 = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract ERC20 {
    string public name;
    string public symbol;

    constructor(string memory _name, string memory _symbol) {
        name = _name;
        symbol = _symbol;
    }

    function decimals() public pure returns (uint8) {
        return 18;
    }
}
`;

const contract = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor() ERC20("MyToken", "TKN") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }
}  
`;

const relativeContract = `
  // SPDX-License-Identifier: MIT
  pragma solidity ^0.8.9;
  
  import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
  
  contract Extender {
    function foo() public pure returns (string memory) {
      return "foo";
    }
  }
`;

const finalInput = _.uniqBy(findFiles(contract, "MyToken.sol"), "path");

// reduce finalInput to a single object where "path" is the key of object
// and "content" is the value
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
    "MyToken.sol": {
      content: contract,
    },
    ...finalInputObject,

    // path to the absolute file on disk
    // "@openzeppelin/contracts/token/ERC20/ERC20.sol": {
    //   content: fs.readFileSync(
    //     "./node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol",
    //     "utf8"
    //   ),
    // },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

console.log("input", JSON.stringify(input, undefined, 4));

// New syntax (supported from 0.5.12, mandatory from 0.6.0)
const output = JSON.parse(solc.compile(JSON.stringify(input)));

console.log("output", JSON.stringify(output, undefined, 4));

// res.status(200).json({
//   abi: output.contracts["MyToken.sol"]["MyToken"].abi,
//   bytecode: output.contracts["MyToken.sol"]["MyToken"].evm.bytecode.object,
// });
// }
