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

export type ContractType = typeof CONTRACTS[number]['id'];

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

export type Features = typeof FEATURES[number]['id'];

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
] as const;

export type AccesControl = typeof ACCESS_CONTROLS[number]['id'];

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

export type Library = typeof LIBRARIES[number]['id'];

export const UPGRADEABLE = [
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
];

export type Upgradeable = typeof UPGRADEABLE[number]['id'];

export const FLAGS = {
  contactsForm: true,
}