"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import _ from "lodash";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ModeToggle } from "@/components/ModeToggle";
import { Separator } from "@/components/ui/separator";

import CodeDisplay from "./CodeDisplay";
import { ContractSelect } from "./ContractSelect";
import { LibrarySelect } from "./LibrarySelect";

import { ERC20_OpenZeppelin, ERC20_Solmate } from "../templates/ERC20.js";
import { ERC721_OpenZeppelin, ERC721_Solmate } from "../templates/ERC721.js";

const formSchema = z.object({
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
  type: z.enum(["all", "mentions", "none"], {
    required_error: "You need to select a notification type.",
  }),
  license: z.string({
    required_error: "License is required",
  }),
});

export const contracts = [
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

const features = [
  {
    id: "mint",
    label: "Mintable",
  },
  {
    id: "burn",
    label: "Burnable",
  },
  {
    id: "pause",
    label: "Pausable",
  },
  {
    id: "permit",
    label: "Permit",
  },
] as const;

const accessControl = [
  {
    id: "ownable",
    label: "Ownable",
  },
  {
    id: "roles",
    label: "Roles",
  },
  {
    id: "none",
    label: "None",
  },
] as const;

export const libraries = [
  {
    id: "openzeppelin",
    label: "OpenZeppelin",
  },
  {
    id: "solmate",
    label: "Solmate",
  },
] as const;

export function ContractsForm() {
  const [code, setCode] = React.useState(`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor() ERC20("MyToken", "TKN") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }
}
`);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contract: "erc20",
      library: "openzeppelin",
      baseURI: "",
      name: "MyToken",
      symbol: "TKN",
      premint: 1000000,
      features: [],
      accessControl: "none",
      license: "MIT",
    },
  });
  const contract = form.watch("contract");
  const library = form.watch("library");

  function onChange() {
    const values = form.getValues();
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
      license: values.license,
    };

    const template =
      values.contract == "erc721"
        ? values.library == "openzeppelin"
          ? ERC721_OpenZeppelin
          : ERC721_Solmate
        : values.library == "openzeppelin"
        ? ERC20_OpenZeppelin
        : ERC20_Solmate;

    const compiled_temp = _.template(template)(data);
    setCode(compiled_temp);
  }

  function setContract(contract: string) {
    form.setValue("contract", contract);
  }

  function setLibrary(library: string) {
    form.setValue("library", library);
    onChange();
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Navigation */}
      <nav className="p-4">
        <div className="mx-auto flex items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🚧</div>
            <div className="text-md font-semibold">smart contracts builder</div>
          </div>

          <div className="flex gap-4">
            <ContractSelect onValueChange={setContract} />
            <LibrarySelect onValueChange={setLibrary} />
          </div>

          <ModeToggle />
        </div>
      </nav>

      <Separator />

      {/* Main content */}
      <div className="flex flex-grow overflow-hidden">
        {/* Left Column */}
        <div className="p-4 overflow-y-auto" style={{ width: "350px" }}>
          <Form {...form}>
            <form onChange={onChange} className="space-y-5">
              {/* <FormField
                control={form.control}
                name="contract"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Contract</FormLabel>
                    <FormControl>
                      <RadioGroup
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        {contracts.map(({ id, label }, idx) => (
                          <FormItem
                            key={idx}
                            className="flex items-center space-x-3 space-y-0"
                          >
                            <FormControl>
                              <RadioGroupItem
                                onClick={() => {
                                  form.setValue("contract", id);
                                }}
                                value={id}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {label}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              {/* <FormField
                control={form.control}
                name="library"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Library</FormLabel>
                    <FormControl>
                      <RadioGroup
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        {libraries.map(({ id, label }, idx) => (
                          <FormItem
                            key={idx}
                            className="flex items-center space-x-3 space-y-0"
                          >
                            <FormControl>
                              <RadioGroupItem
                                onClick={() => {
                                  form.setValue("library", id);
                                }}
                                value={id}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {label}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="symbol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Symbol</FormLabel>
                    <FormControl>
                      <Input placeholder="Symbol" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {contract == "erc721" && (
                <FormField
                  control={form.control}
                  name="baseURI"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base URI</FormLabel>
                      <FormControl>
                        <Input placeholder="ipfs://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="premint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Premint</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              <FormField
                control={form.control}
                name="features"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Features</FormLabel>
                      <FormDescription>
                        Select the additional features to add.
                      </FormDescription>
                    </div>

                    {features.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="features"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={
                                    field.value?.includes(item.id) ||
                                    (item.id == "permit" &&
                                      library == "solmate")
                                  }
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          item.id,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item.id
                                          )
                                        );
                                  }}
                                  disabled={
                                    item.id == "permit" && library == "solmate"
                                  }
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              <FormField
                control={form.control}
                name="accessControl"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Access Control</FormLabel>
                    <FormControl>
                      <RadioGroup
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        {accessControl.map(({ id, label }, idx) => (
                          <FormItem
                            key={idx}
                            className="flex items-center space-x-3 space-y-0"
                          >
                            <FormControl>
                              <RadioGroupItem
                                onClick={() => {
                                  form.setValue("accessControl", id);
                                }}
                                value={id}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {label}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              <FormField
                control={form.control}
                name="license"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>License</FormLabel>
                    <FormControl>
                      <Input placeholder="License" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <Separator orientation="vertical" />

        {/* Right Column */}
        <div className="flex-grow overflow-y-auto">
          <CodeDisplay value={code} />
        </div>
      </div>
    </div>
  );
}
