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
  const fullImportsRegex = /import\s+(?:{.*?}\s+from\s+)?['"](.*?)['"];/g;
  const newFullImports = contractCode.match(fullImportsRegex);

  if (!newFullImports) return [...imports];

  const newlyFoundImports = [];

  for (let i = 0; i < newFullImports.length; i++) {
    const importFullStatement = newFullImports[i];

    const importPathRegex = /import\s+(?:{.*?}\s+from\s+)?['"](.*?)['"]/;
    const importPathMatch = importFullStatement.match(importPathRegex);

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
      "src/lib",
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
