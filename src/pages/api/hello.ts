import fs from "fs";
import path from "path";
import solc from "solc";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
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
    constructor() ERC20("MyToken", "TKN") {}
}
`;

const contract2 = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract MyToken2 {
    string public name;

    constructor() {
      name = "Hello";
    }
}
`;

  // const contractsPath = `./contracts/contracts/Test_${new Date().valueOf()}.sol`;
  // fs.writeFileSync(contractsPath, contract);

  // const pathA = path.resolve(__dirname, "contracts", "A.sol");
  // //to find the path of A.sol inside the folder 'contract' in your project
  // const pathB = path.resolve(__dirname, "contracts", "B.sol");
  // const solA = fs.readFileSync(pathA, "utf8");
  // const solB = fs.readFileSync(pathB, "utf8");

  // const libPath = path.resolve(__dirname, "contracts", "Lib.sol");
  // const libSol = fs.readFileSync(
  //   "/Users/karolis/Code/smart-contracts-builder/src/contracts/Lib.sol",
  //   "utf8"
  // );

  const input = {
    language: "Solidity",
    sources: {
      "MyToken.sol": {
        content: contract,
      },
      "@openzeppelin/contracts/token/ERC20/ERC20.sol": {
        content: erc20,
      },
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

  // console.log(JSON.stringify(data, undefined, 4));

  // function findImports(path) {
  //   // ./@openzeppelin/contracts/token/ERC20/ERC20.sol

  //   console.log("path", path);

  //   // if file starts with openzeppelin
  //   if (path.startsWith("@openzeppelin")) {
  //     const filePath = path.replace("@openzeppelin/contracts/", "");
  //     const importSourceCode = fs.readFileSync(
  //       `/Users/karolis/Code/smart-contracts-builder/node_modules/${path}`
  //     );

  //     return { contents: `${importSourceCode}` };
  //   }

  //   const importSourceCode = fs.readFileSync(`./${path}`);
  //   return { contents: `${importSourceCode}` };
  // }

  // New syntax (supported from 0.5.12, mandatory from 0.6.0)
  var output = JSON.parse(solc.compile(JSON.stringify(input)));

  // console.log(output.contracts["test.sol"].MyToken.evm.bytecode.object);
  // console.log(output.contracts["test.sol"].MyToken.abi);

  // `output` here contains the JSON output as specified in the documentation
  // for (var contractName in output.contracts["MyToken2.sol"]) {
  //   console.log(
  //     contractName +
  //       ": " +
  //       output.contracts["MyToken2.sol"][contractName].evm.bytecode.object
  //   );
  // }

  res.status(200).json({
    abi: output.contracts["MyToken.sol"]["MyToken"].abi,
    bytecode: output.contracts["MyToken.sol"]["MyToken"].evm.bytecode.object,
  });
}
