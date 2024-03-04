import { z } from "zod";

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
      label: "None",
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
  features: z.enum(["mint", "burn", "pause", "permit"], {
    description: "Select the additional features to add.",
  }),
  accessControl: z.enum(["ownable", "roles", "none"]),
  upgradeability: z.enum(["transparent", "uups", "none"]),
  license: z.string({
    required_error: "License is required",
  }),
  pragma: z.string({
    required_error: "Pragma is required",
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
    baseURI: z.string().optional(),
  }),

  premint: z.coerce.number().optional(),
  features: z.array(z.string()),
  accessControl: z.enum(["ownable", "roles", "none"]),
  upgradeability: z.enum(["transparent", "uups", "none"]),
  type: z.enum(["all", "mentions", "none"], {
    required_error: "You need to select a notification type.",
  }),
  license: z.string({
    required_error: "License is required",
  }),
  pragma: z.string({
    required_error: "Pragma is required",
  }),
});

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
  license: z.string({
    required_error: "License is required",
  }),
  pragma: z.string({
    required_error: "Pragma is required",
  }),
});

export const formSchemaDefaultValues = {
  contract: "erc20",
  library: "openzeppelin",
  baseURI: "",
  name: "MyToken",
  symbol: "TKN",
  premint: 1000000,
  features: [],
  accessControl: "none",
  upgradeability: "none",
  license: "MIT",
  pragma: "^0.8.21",
};
