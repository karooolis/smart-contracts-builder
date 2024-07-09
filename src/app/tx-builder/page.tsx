"use client";

import React, { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import _ from "lodash";
import { z } from "zod";

import { ConnectButton } from "@/components/ConnectButton";
import { ModeToggle } from "@/components/ModeToggle";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  address: z.string().min(2, {
    message: "address must be at least 2 characters.",
  }),
  abi: z.string().min(2, {
    message: "abi must be at least 2 characters.",
  }),
  function: z.string().min(2, {
    message: "function must be at least 2 characters.",
  }),
  inputs: z.array(z.string()),
});

export function SimulatorForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "0x904ef98751c82f77b7b66765e393fa0c84dafc2f",
      abi: `[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"allowance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientAllowance","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientBalance","type":"error"},{"inputs":[{"internalType":"address","name":"approver","type":"address"}],"name":"ERC20InvalidApprover","type":"error"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC20InvalidReceiver","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"ERC20InvalidSender","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"}],"name":"ERC20InvalidSpender","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"value","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"burnFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]`,
      function: "burnFrom",
      inputs: [],
    },
  });

  const abi = form.watch("abi");
  const fn = form.watch("function");
  const selectedFn = useMemo(() => {
    if (!abi) {
      return;
    }

    const parsedAbi = JSON.parse(abi);
    return parsedAbi.find((item: any) => item.name === fn);
  }, [abi, fn]);

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  function onABIChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = event.target.value;
    const abi = JSON.parse(value);
    return;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-96 space-y-8">
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contract address</FormLabel>
              <FormControl>
                <Input placeholder="Enter address ..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="abi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contract ABI</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter ABI ..."
                  {...field}
                  onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                    onABIChange(event);
                    field.onChange(event);
                  }}
                />
              </FormControl>
              <FormMessage />

              <div className="flex gap-2">
                <Badge variant="secondary" className="cursor-pointer">
                  ERC20
                </Badge>
                <Badge variant="secondary" className="cursor-pointer">
                  ERC721
                </Badge>
                <Badge variant="secondary" className="cursor-pointer">
                  ERC1155
                </Badge>
              </div>
            </FormItem>
          )}
        />

        {abi && (
          <>
            <FormField
              control={form.control}
              name="function"
              render={({ field }) => {
                const parsedAbi = JSON.parse(abi);
                const functions = parsedAbi.filter(
                  (item: any) => item.type === "function",
                );

                return (
                  <FormItem>
                    <FormLabel>Function</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a function to execute" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-60">
                        {functions.map((item: any) => {
                          return (
                            <SelectItem key={item.name} value={item.name}>
                              {item.name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            {selectedFn &&
              selectedFn?.inputs.map((item: any, idx: number) => {
                return (
                  <FormField
                    key={item.name}
                    control={form.control}
                    name={`inputs.${idx}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {item.name}{" "}
                          <span className="opacity-70">({item.type})</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter input ..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              })}
          </>
        )}

        <div className="flex gap-3">
          <Button type="submit" variant="outline">
            Simulate
          </Button>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Navigation */}
      <nav className="px-4 py-3">
        <div className="mx-auto flex items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🚧</div>
            <div className="text-md hidden font-semibold xl:inline-block">
              smart contracts builder
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* <Jobs /> */}
            <ConnectButton />
            <ModeToggle />
          </div>
        </div>
      </nav>

      <Separator />

      <div className="mx-auto max-w-lg py-8">
        <SimulatorForm />
      </div>
    </div>
  );
}
