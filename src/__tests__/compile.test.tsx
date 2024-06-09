// import { expect, test } from "vitest";
import "@testing-library/jest-dom";
import { compile } from "../pages/api/helpers/compile";
import { constructForm } from "../components/ContractOptionsForm/ContractOptionsForm";
import { SCHEMAS_MAP } from "../components/ContractOptionsForm/constants";
import { getTemplate } from "../utils/templates";

describe("Compiler", () => {
  it("renders a heading", () => {
    const contractType = "erc721";
    const library = "openzeppelin";
    // const formSchema = SCHEMAS_MAP[contractType]; // TODO: create all schemas
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

    const contract = getTemplate(values, contractType, library);
    const result = compile(values.name, contract);

    expect(result.output.errors).toBe(undefined);
  });
});
