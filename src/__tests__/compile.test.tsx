import { expect, test } from "vitest";
import { compile } from "../pages/api/helpers/compile";

test("Compile", () => {
  const name = "MyToken";
  const contract = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor() ERC20("MyToken", "TKN") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
  `;

  const result = compile(name, contract);

  expect(result.output.errors).toBe(undefined);
});
