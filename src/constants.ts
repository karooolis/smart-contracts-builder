import { z } from "zod";

export const CONTRACTS = [
  {
    id: "erc20",
    label: "ERC20: Token",
    isReady: true,
  },
  {
    id: "erc721",
    label: "ERC721: NFT",
    isReady: true,
  },
  {
    id: "erc1155",
    label: "ERC1155: Multi-token",
    isReady: false,
  },
  {
    id: "erc4626",
    label: "ERC4626: Vault",
    isReady: false,
  },
  {
    id: "vesting",
    label: "Vesting",
    isReady: false,
  },
  {
    id: "crowdsale",
    label: "Crowdsale",
    isReady: false,
  },
  {
    id: "flashloan",
    label: "Flashloan",
    isReady: false,
  },
] as const;

export type ContractType = (typeof CONTRACTS)[number]["id"];

export const FEATURES = [
  {
    id: "mint",
    label: "Mintable",
    info: "Privileged accounts will be able to create more supply.",
  },
  {
    id: "burn",
    label: "Burnable",
    info: "Token holders will be able to destroy their tokens.",
  },
  {
    id: "pause",
    label: "Pausable",
    info: "Privileged accounts will be able to pause the functionality marked as whenNotPaused. Useful for emergency response.",
  },
  {
    id: "permit",
    label: "Permit",
    info: "Without paying gas, token holders will be able to allow third parties to transfer from their account.",
  },
] as const;

export type Features = (typeof FEATURES)[number]["id"];

export const ACCESS_CONTROLS = [
  {
    id: "ownable",
    label: "Ownable",
    info: "Simple mechanism with a single account authorized for all privileged actions.",
  },
  {
    id: "roles",
    label: "Roles",
    info: "Flexible mechanism with a separate role for each privileged action. A role can have many authorized accounts.",
  },
  {
    id: "none",
    label: "none",
  },
] as const;

export type AccessControl = (typeof ACCESS_CONTROLS)[number]["id"];

export const LIBRARIES = [
  {
    id: "openzeppelin",
    label: "OpenZeppelin",
  },
  {
    id: "solmate",
    label: "Solmate",
  },
  {
    id: "solady",
    label: "Solady (coming soon)",
  },
] as const;

export type Library = (typeof LIBRARIES)[number]["id"];

export const UPGRADEABILITY = [
  {
    id: "transparent",
    label: "Transparent",
    info: "Uses more complex proxy with higher overhead, requires less changes in your contract. Can also be used with beacons.",
  },
  {
    id: "uups",
    label: "UUPS",
    info: "Uses simpler proxy with less overhead, requires including extra code in your contract. Allows flexibility for authorizing upgrades.",
  },
  {
    id: "none",
    label: "none",
  },
] as const;

export type Upgradeability = (typeof UPGRADEABILITY)[number]["id"];

export const FLAGS = {
  contactsForm: true,
};

export const OPTIONS_FIELDS = {
  features: {
    mint: {
      id: "mint",
      label: "Mintable",
      info: "Privileged accounts will be able to create more supply.",
    },
    burn: {
      id: "burn",
      label: "Burnable",
      info: "Token holders will be able to destroy their tokens.",
    },
    pause: {
      id: "pause",
      label: "Pausable",
      info: "Privileged accounts will be able to pause the functionality marked as whenNotPaused. Useful for emergency response.",
    },
    permit: {
      id: "permit",
      label: "Permit",
      info: "Without paying gas, token holders will be able to allow third parties to transfer from their account.",
    },
  },
  accessControl: {
    ownable: {
      id: "ownable",
      label: "Ownable",
      info: "Simple mechanism with a single account authorized for all privileged actions.",
    },
    roles: {
      id: "roles",
      label: "Roles",
      info: "Flexible mechanism with a separate role for each privileged action. A role can have many authorized accounts.",
    },
    none: {
      id: "none",
      label: "none",
    },
  },
};

export const contractOptionsSchema = z.object({
  library: z.enum(["openzeppelin", "solmate"]),
  contract: z.enum([
    "erc20",
    "erc721",
    "erc1155",
    "erc4626",
    "vesting",
    "crowdsale",
    "flashloan",
  ]),
});

export const ERC20_SCHEMA = z.object({
  general: z.object({
    name: z.string().min(2, {
      message: "name must be at least 2 characters.",
    }),
    symbol: z.string().min(1, {
      message: "symbol must be at least 1 characters.",
    }),
    premint: z.coerce
      .number()
      .describe("Create an initial amount of tokens for the deployer."),
  }),
  features: z.array(["mint", "burn", "pause", "permit"], {
    description: "Select the additional features to add.",
  }),
  accessControl: z.enum(["ownable", "roles", "none"]),
  upgradeability: z.enum(["transparent", "uups", "none"]),
  license: z.string({
    required_error: "License is required",
  }),
});

export const ERC721_SCHEMA = z.object({
  general: z.object({
    name: z.string().min(2, {
      message: "name must be at least 2 characters.",
    }),
    symbol: z.string().min(1, {
      message: "symbol must be at least 1 characters.",
    }),
    baseURI: z
      .string()
      .describe(
        "Will be concatenated with token IDs to generate the token URIs.",
      ),
  }),
  features: z.array(["mint", "burn", "pause"], {
    description: "Select the additional features to add.",
  }),
  accessControl: z.enum(["ownable", "roles", "none"]),
  upgradeability: z.enum(["transparent", "uups", "none"]),

  verify: z.boolean().optional(),

  license: z.string({
    required_error: "License is required",
  }),
});

export const SCHEMAS_MAP = {
  erc20: ERC20_SCHEMA,
  erc721: ERC721_SCHEMA,
} as const;

// TODO: old schema, need to replace
export const formSchema = z.object({
  contract: z.enum([
    "erc20",
    "erc721",
    "erc1155",
    "erc4626",
    "vesting",
    "crowdsale",
    "flashloan",
  ]),
  library: z.enum(["openzeppelin", "solmate"]),
  name: z.string().min(2, {
    message: "name must be at least 2 characters.",
  }),
  symbol: z.string().min(1, {
    message: "symbol must be at least 1 characters.",
  }),
  baseURI: z.string().optional(),
  premint: z.coerce.number().optional(),
  features: z.array(z.string()),
  accessControl: z.enum(["ownable", "roles", "none"]),
  upgradeability: z.enum(["transparent", "uups", "none"]),
  type: z.enum(["all", "mentions", "none"], {
    required_error: "You need to select a notification type.",
  }),
  verify: z.boolean().optional(),
  license: z.string({
    required_error: "License is required",
  }),
  pragma: z.string({
    required_error: "Pragma is required",
  }),
});

export const formSchemaDefaultValues = {
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
} as const;
