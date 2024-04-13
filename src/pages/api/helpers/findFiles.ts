import fs from "fs";
import path from "path";
import _ from "lodash";
import { isRelativePath } from "./isRelativePath";

export const findFiles = (
  contractCode: string,
  importContextPath: string,
  imports: Array<{ path: string; content: string; }> = []
): Array<{ path: string; content: string; }> => {
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
