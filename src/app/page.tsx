"use client";

import React from "react";
import _ from "lodash";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";

import { ConnectButton } from "@/components/ConnectButton";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ModeToggle } from "@/components/ModeToggle";
import { Separator } from "@/components/ui/separator";

import { FEATURES, ACCESS_CONTROLS, UPGRADEABLE } from "@/constants";
import CodeDisplay from "@/components/CodeDisplay";
import { ContractSelect } from "@/components/ContractSelect";
import { LibrarySelect } from "@/components/LibrarySelect";
import { ExplanationTooltip } from "@/components/ExplanationTooltip";
import { Jobs } from "@/components/Jobs";

import { ERC20_Initial } from "../templates/ERC20_Initial.js";

import { getTemplate } from "@/utils/templates";

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

export default function Home() {
  const [code, setCode] = React.useState(ERC20_Initial);

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
      upgradeability: "none",
      license: "MIT",
      pragma: "^0.8.21",
    },
  });
  const contract = form.watch("contract");
  const library = form.watch("library");
  const featuresValues = form.watch("features");
  const mintable = featuresValues.includes("mint");
  const burnable = featuresValues.includes("burn");
  const pausable = featuresValues.includes("pause");
  const accessControl = form.watch("accessControl");
  const upgradeability = form.watch("upgradeability");
  const name = form.watch("name");

  function onChange() {
    const values = form.getValues();
    const template = getTemplate(values);
    setCode(template);
  }

  function setContract(contract: z.infer<typeof formSchema>["contract"]) {
    form.setValue("contract", contract);
  }

  function setLibrary(library: z.infer<typeof formSchema>["library"]) {
    form.setValue("library", library);
    onChange();
  }

  // set access control ON if mintable, burnable or pausable
  React.useEffect(() => {
    // if (
    //   accessControl == "none" &&
    //   (mintable || burnable || pausable || upgradeability == "uups")
    // ) {
    //   form.setValue("accessControl", "ownable");
    // }
  }, [accessControl, burnable, form, mintable, pausable, upgradeability]);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Navigation */}
      <nav className="px-4 py-3">
        <div className="mx-auto flex items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🚧</div>
            <div className="hidden lg:inline-block text-md font-semibold">
              smart contracts builder
            </div>
          </div>

          <div className="flex gap-4">
            <ContractSelect onValueChange={setContract} />
            <LibrarySelect onValueChange={setLibrary} />
          </div>

          <div className="flex items-center gap-4">
            <Jobs />
            <ConnectButton />
            <ModeToggle />
          </div>
        </div>
      </nav>

      <Separator />

      {/* Main content */}
      <div className="flex flex-grow overflow-hidden pb-3">
        {/* Left Column */}
        <div className="p-4 overflow-y-auto" style={{ width: "290px" }}>
          <Form {...form}>
            <form onChange={onChange} className="space-y-5">
              <div className="flex space-x-3">
                <div className="flex-grow w-3/4">
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
                </div>

                <div className="flex-grow w-1/4">
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
                </div>
              </div>

              {contract == "erc721" && (
                <FormField
                  control={form.control}
                  name="baseURI"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex w-full justify-between">
                        Base URI{" "}
                        <ExplanationTooltip>
                          Will be concatenated with token IDs to generate the
                          token URIs.
                        </ExplanationTooltip>
                      </FormLabel>
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
                    <FormLabel className="flex w-full justify-between">
                      Premint{" "}
                      <ExplanationTooltip>
                        Create an initial amount of tokens for the deployer.
                      </ExplanationTooltip>
                    </FormLabel>
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

                    {FEATURES.map((item) => (
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
                              <FormLabel className="flex w-full font-normal justify-between">
                                {item.label}{" "}
                                {item.info && (
                                  <ExplanationTooltip>
                                    {item.info}
                                  </ExplanationTooltip>
                                )}
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
                    <FormLabel className="flex justify-between items-center">
                      Access Control{" "}
                      <Switch
                        className="scale-75"
                        checked={field.value != "none"}
                        onCheckedChange={() => {
                          if (field.value == "none") {
                            form.setValue("accessControl", "ownable");
                          } else {
                            form.setValue("accessControl", "none");
                          }
                        }}
                      />
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        value={field.value}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        {ACCESS_CONTROLS.map(({ id, label, info }, idx) => (
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
                                disabled={accessControl == "none"}
                              />
                            </FormControl>
                            <FormLabel
                              className={cn(
                                "flex w-full justify-between font-normal",
                                accessControl == "none" && "line-through"
                              )}
                            >
                              {label}{" "}
                              {info && (
                                <ExplanationTooltip>{info}</ExplanationTooltip>
                              )}
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
                name="upgradeability"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="flex justify-between items-center">
                      Upgradeability
                      <Switch
                        className="scale-75"
                        checked={field.value != "none"}
                        onCheckedChange={() => {
                          if (field.value == "none") {
                            form.setValue("upgradeability", "transparent");
                          } else {
                            form.setValue("upgradeability", "none");
                          }
                        }}
                      />
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        value={field.value}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        {UPGRADEABLE.map(({ id, label, info }, idx) => (
                          <FormItem
                            key={idx}
                            className="flex items-center space-x-3 space-y-0"
                          >
                            <FormControl>
                              <RadioGroupItem
                                onClick={() => {
                                  form.setValue("upgradeability", id);
                                }}
                                value={id}
                                disabled={upgradeability == "none"}
                              />
                            </FormControl>
                            <FormLabel
                              className={cn(
                                "flex w-full justify-between font-normal",
                                upgradeability == "none" && "line-through"
                              )}
                            >
                              {label}{" "}
                              {info && (
                                <ExplanationTooltip>{info}</ExplanationTooltip>
                              )}
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

              {/* <FormField
                control={form.control}
                name="pragma"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pragma</FormLabel>
                    <FormControl>
                      <Input placeholder="Pragma" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            </form>
          </Form>
        </div>

        <Separator orientation="vertical" />

        {/* Right Column */}
        <div className="flex-grow overflow-y-auto">
          <CodeDisplay name={name} value={code} contractType={contract} />
        </div>
      </div>
    </div>
  );
}
