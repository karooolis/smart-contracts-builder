"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import _ from "lodash";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import { ERC20 } from "../templates/ERC20.js";

import CodeDisplay from "./CodeDisplay";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "name must be at least 2 characters.",
  }),
  symbol: z.string().min(1, {
    message: "symbol must be at least 1 characters.",
  }),
  premint: z.coerce.number(),
  features: z.array(z.string()),
  accessControl: z.enum(["ownable", "roles", "none"]),
  type: z.enum(["all", "mentions", "none"], {
    required_error: "You need to select a notification type.",
  }),
  license: z.string({
    required_error: "License is required",
  }),
});

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
      name: "MyToken",
      symbol: "TKN",
      premint: 1000000,
      features: [],
      accessControl: "none",
      license: "MIT",
    },
  });

  function onChange() {
    const values = form.getValues();

    const data = {
      tokenName: values.name,
      tokenSymbol: values.symbol,
      initialSupply: values.premint,
      premint: values.premint > 0,
      mint: values.features.includes("mint"),
      burn: values.features.includes("burn"),
      pause: values.features.includes("pause"),
      permit: values.features.includes("permit"),
      ownable: values.accessControl == "ownable", // Whether to make the contract ownable
      roles: values.accessControl == "roles", // Whether to incorporate roles for specific actions,
      license: values.license,
    };

    const compiled_temp = _.template(ERC20)(data);
    setCode(compiled_temp);
  }

  return (
    <>
      <Form {...form}>
        <form onChange={onChange} className="space-y-8">
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
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.id
                                      )
                                    );
                              }}
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
                        <FormLabel className="font-normal">{label}</FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

      <CodeDisplay value={code} />
    </>
  );
}
