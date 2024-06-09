import "@testing-library/jest-dom";
import { compile } from "../pages/api/helpers/compile";
import { getTemplate } from "../utils/templates";
import {
  ContractType,
  Features,
  AccessControl,
  Library,
  Upgradeability,
} from "@/constants";

// const TESTED_CONTRACTS: ContractType[] = ["erc20", "erc721"];
// const TESTED_FEATURES: Features[] = ["burn", "mint", "pause", "permit"];
// const TESTED_ACCESS_CONTROL: AccessControl[] = ["ownable", "roles", "none"];
// const TESTED_UPGRADEABILITY: Upgradeability[] = ["transparent", "uups", "none"];
// const TESTED_LIBRARIES: Library[] = ["openzeppelin"];

const TESTED_CONTRACTS: ContractType[] = ["erc20"];
const TESTED_FEATURES: Features[] = ["burn", "mint", "pause", "permit"];
const TESTED_ACCESS_CONTROL: AccessControl[] = ["ownable", "roles", "none"];
const TESTED_UPGRADEABILITY: Upgradeability[] = ["transparent", "uups", "none"];
const TESTED_LIBRARIES: Library[] = ["solmate"];

describe("Compiles:", () => {
  for (let i = 0; i < TESTED_CONTRACTS.length; i++) {
    const contractType = TESTED_CONTRACTS[i];

    for (let j = 0; j < TESTED_FEATURES.length; j++) {
      const features = TESTED_FEATURES.slice(0, j + 1);

      for (let k = 0; k < TESTED_ACCESS_CONTROL.length; k++) {
        const accessControl = TESTED_ACCESS_CONTROL[k];

        for (let g = 0; g < TESTED_UPGRADEABILITY.length; g++) {
          const upgradeability = TESTED_UPGRADEABILITY[g];

          for (let l = 0; l < TESTED_LIBRARIES.length; l++) {
            const library = TESTED_LIBRARIES[l];

            it(`(${library}) ${contractType.toUpperCase()}: ${features.join(", ")} - ${accessControl} - ${upgradeability}`, () => {
              const values = {
                baseURI: "",
                name: "Token",
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
          }
        }
      }
    }
  }
});
