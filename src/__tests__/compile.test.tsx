// import { expect, test } from "vitest";
import "@testing-library/jest-dom";
import { compile } from "../pages/api/helpers/compile";
import { constructForm } from "../components/ContractOptionsForm/ContractOptionsForm";
import { SCHEMAS_MAP } from "../components/ContractOptionsForm/constants";
import { getTemplate } from "../utils/templates";


describe("Page", () => {
  it("renders a heading", () => {
    const contractType = "erc721";
    const library = "openzeppelin";
    const formSchema = SCHEMAS_MAP[contractType];
    const values = {
      baseURI: "",
      name: "MyToken",
      symbol: "TKN",
      premint: 1000000,
      features: [],
      accessControl: "none",
      upgradeability: "none",
      verify: true,
      license: "MIT",
      pragma: "^0.8.25",
    };

    const template = getTemplate(values, contractType, library);
    console.log("template res", template);

    //   const name = "MyToken";
    //   const contract = `
    // // SPDX-License-Identifier: MIT
    // pragma solidity ^0.8.25;

    // import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

    // contract MyToken is ERC20 {
    //     constructor() ERC20("MyToken", "TKN") {
    //         _mint(msg.sender, 1000000 * 10 ** decimals());
    //     }

    //     function mint(address to, uint256 amount) public {
    //         _mint(to, amount);
    //     }
    // }
    //   `;

    //   const result = compile(name, contract);

    //   expect(result.output.errors).toBe(undefined);
  });
});
