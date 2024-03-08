import _ from "lodash";
import * as z from "zod";
import { formSchema } from "@/components/ContractOptionsForm/constants";

import ERC20_OpenZeppelin_Imports from "../templates/ERC20/OpenZeppelin/Imports.sol";
import ERC20_OpenZeppelin from "../templates/ERC20/OpenZeppelin/ERC20.sol";

import ERC20_Solmate_Imports from "../templates/ERC20/Solmate/Imports.sol";
import ERC20_Solmate from "../templates/ERC20/OpenZeppelin/ERC20.sol";

import ERC721_OpenZeppelin from "../templates/ERC721/OpenZeppelin/ERC721.sol";
import ERC721_Solmate from "../templates/ERC721/Solmate/ERC721.sol";

export const getImports = (values: z.infer<typeof formSchema>) => {
  const importsTemplate =
    values.library == "openzeppelin"
      ? ERC20_OpenZeppelin_Imports
      : ERC20_Solmate_Imports;

  return _.template(importsTemplate)({
    mint: values.features.includes("mint"),
    burn: values.features.includes("burn"),
    pause: values.features.includes("pause"),
    permit: values.features.includes("permit"),
    ownable: values.accessControl == "ownable", // Whether to make the contract ownable
    roles: values.accessControl == "roles", // Whether to incorporate roles for specific actions,
    upgradeability: values.upgradeability,
  }).replace(/[\r\n]/gm, "");
};

export const getTemplate = (values: z.infer<typeof formSchema>) => {
  const template =
    values.contract == "erc721"
      ? values.library == "openzeppelin"
        ? ERC721_OpenZeppelin
        : ERC721_Solmate
      : values.library == "openzeppelin"
        ? ERC20_OpenZeppelin
        : ERC20_Solmate;

  const data = {
    tokenName: values.name,
    tokenSymbol: values.symbol,
    baseURI: values.baseURI,
    initialSupply: values.premint,
    premint: values.premint && values.premint > 0,
    mint: values.features.includes("mint"),
    burn: values.features.includes("burn"),
    pause: values.features.includes("pause"),
    permit: values.features.includes("permit"),
    ownable: values.accessControl == "ownable", // Whether to make the contract ownable
    roles: values.accessControl == "roles", // Whether to incorporate roles for specific actions,
    upgradeability: values.upgradeability,
    license: values.license,
    pragma: values.pragma,
    imports: getImports(values),
  };

  console.log(values, data);


  return _.template(template)(data);
};
