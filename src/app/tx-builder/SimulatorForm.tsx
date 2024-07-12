"use client";

import React, { useMemo, useState } from "react";
import _ from "lodash";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Hex } from "viem";
import {
  readContract,
  writeContract,
  waitForTransactionReceipt,
} from "@wagmi/core";
import { Coins, Eye, Loader2, Send } from "lucide-react";

import { wagmiConfig } from "@/app/providers";
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
import { Separator } from "@/components/ui/separator";

import ERC20_ABI from "./abis/ERC20.json";
import ERC721_ABI from "./abis/ERC721.json";
import ERC1155_ABI from "./abis/ERC1155.json";

// monkey patch BigInt - https://github.com/GoogleChromeLabs/jsbi/issues/30#issuecomment-1006086291
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

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
  inputs: z.array(z.string().optional()),
});

export function SimulatorForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "0xd0e1065f2a941dd723f800c34d2d4282c3158a00", // "0xCd9189F872CEb5cCd54Ac81B7f17c97004286764",
      abi: `[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint8","name":"version","type":"uint8"}],"name":"Initialized","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"version","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"opaqueData","type":"bytes"}],"name":"TransactionDeposited","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"withdrawalHash","type":"bytes32"},{"indexed":false,"internalType":"bool","name":"success","type":"bool"}],"name":"WithdrawalFinalized","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"withdrawalHash","type":"bytes32"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"WithdrawalProven","type":"event"},{"inputs":[],"name":"GUARDIAN","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"L2_ORACLE","outputs":[{"internalType":"contract L2OutputOracle","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"SYSTEM_CONFIG","outputs":[{"internalType":"contract SystemConfig","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_value","type":"uint256"},{"internalType":"uint64","name":"_gasLimit","type":"uint64"},{"internalType":"bool","name":"_isCreation","type":"bool"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"depositTransaction","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"donateETH","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"components":[{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"target","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"gasLimit","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"internalType":"struct Types.WithdrawalTransaction","name":"_tx","type":"tuple"}],"name":"finalizeWithdrawalTransaction","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"finalizedWithdrawals","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"guardian","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract L2OutputOracle","name":"_l2Oracle","type":"address"},{"internalType":"contract SystemConfig","name":"_systemConfig","type":"address"},{"internalType":"contract SuperchainConfig","name":"_superchainConfig","type":"address"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_l2OutputIndex","type":"uint256"}],"name":"isOutputFinalized","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"l2Oracle","outputs":[{"internalType":"contract L2OutputOracle","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"l2Sender","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint64","name":"_byteCount","type":"uint64"}],"name":"minimumGasLimit","outputs":[{"internalType":"uint64","name":"","type":"uint64"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"params","outputs":[{"internalType":"uint128","name":"prevBaseFee","type":"uint128"},{"internalType":"uint64","name":"prevBoughtGas","type":"uint64"},{"internalType":"uint64","name":"prevBlockNum","type":"uint64"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"paused_","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"target","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"gasLimit","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"internalType":"struct Types.WithdrawalTransaction","name":"_tx","type":"tuple"},{"internalType":"uint256","name":"_l2OutputIndex","type":"uint256"},{"components":[{"internalType":"bytes32","name":"version","type":"bytes32"},{"internalType":"bytes32","name":"stateRoot","type":"bytes32"},{"internalType":"bytes32","name":"messagePasserStorageRoot","type":"bytes32"},{"internalType":"bytes32","name":"latestBlockhash","type":"bytes32"}],"internalType":"struct Types.OutputRootProof","name":"_outputRootProof","type":"tuple"},{"internalType":"bytes[]","name":"_withdrawalProof","type":"bytes[]"}],"name":"proveWithdrawalTransaction","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"provenWithdrawals","outputs":[{"internalType":"bytes32","name":"outputRoot","type":"bytes32"},{"internalType":"uint128","name":"timestamp","type":"uint128"},{"internalType":"uint128","name":"l2OutputIndex","type":"uint128"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"superchainConfig","outputs":[{"internalType":"contract SuperchainConfig","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"systemConfig","outputs":[{"internalType":"contract SystemConfig","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"stateMutability":"payable","type":"receive"}]`,
      function: "finalizeWithdrawalTransaction",
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
    const selectedFn = parsedAbi.find((item: any) => item.name === fn);
    return selectedFn;
  }, [abi, fn]);

  const onSubmit = async () => {
    const values = form.getValues();
    const address = values.address as Hex;
    const abi = JSON.parse(values.abi);
    const functionName = values.function;
    const functionAbi = abi.find((item: any) => item.name === functionName);
    const functionInputs = functionAbi.inputs;
    const args =
      functionInputs.length > 0
        ? values.inputs.slice(0, functionInputs.length)
        : [];

    const functionMutability = functionAbi.stateMutability;
    const isView =
      functionMutability === "view" || functionMutability === "pure";
    const readWriteFn = isView ? readContract : writeContract;

    console.log({
      abi,
      address,
      functionName,
      args: [
        [
          "1766847064778384329583297500742918515827483896875618958121606201292620769",
          "0x2d4f144897aB9caAe700886C3EE629E165F31591",
          "0x2d4f144897aB9caAe700886C3EE629E165F31591",
          "8415000000000000",
          "100000",
          "0x",
        ],
      ],
    });

    try {
      setLoading(true);
      const result = await readWriteFn(wagmiConfig, {
        abi,
        address,
        functionName,
        args: [
          [
            "1766847064778384329583297500742918515827483896875618958121606201292620769",
            "0x2d4f144897aB9caAe700886C3EE629E165F31591",
            "0x2d4f144897aB9caAe700886C3EE629E165F31591",
            "8415000000000000",
            "100000",
            "0x",
          ],
        ],
      });

      if (isView) {
        setResult(result.toString());
      } else {
        const txHash = result;
        setTxHash(txHash);

        const transactionReceipt = await waitForTransactionReceipt(
          wagmiConfig,
          {
            hash: txHash,
          },
        );
        setResult(transactionReceipt);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-[568px] space-y-8 rounded-md border p-4 shadow"
      >
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
                  className="h-48"
                  placeholder="Enter ABI ..."
                  {...field}
                />
              </FormControl>
              <FormMessage />

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    form.setValue("abi", JSON.stringify(ERC20_ABI, null, 2));
                  }}
                >
                  <Badge variant="secondary" className="cursor-pointer">
                    ERC20
                  </Badge>
                </button>

                <button
                  onClick={() => {
                    form.setValue("abi", JSON.stringify(ERC721_ABI, null, 2));
                  }}
                >
                  <Badge variant="secondary" className="cursor-pointer">
                    ERC721
                  </Badge>
                </button>

                <button
                  onClick={() => {
                    form.setValue("abi", JSON.stringify(ERC1155_ABI, null, 2));
                  }}
                >
                  <Badge variant="secondary" className="cursor-pointer">
                    ERC1155
                  </Badge>
                </button>
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
                        {functions.map((item: any, idx: number) => {
                          const inputs = item.inputs
                            .map((input: any) => {
                              let params = input.type;
                              if (input.name) {
                                params += ` ${input.name}`;
                              }
                              return params;
                            })
                            .join(", ");

                          return (
                            <SelectItem key={idx} value={item.name}>
                              {item.stateMutability === "payable" && (
                                <Coins className="mr-2 inline-block h-4 w-4" />
                              )}
                              {(item.stateMutability === "view" ||
                                item.stateMutability === "pure") && (
                                <Eye className="mr-2 inline-block h-4 w-4" />
                              )}
                              {item.stateMutability === "nonpayable" && (
                                <Send className="mr-2 inline-block h-4 w-4" />
                              )}
                              {item.name}{" "}
                              {inputs && (
                                <span className="opacity-70">({inputs})</span>
                              )}
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

            {selectedFn && selectedFn?.inputs.length > 0 && (
              <>
                <Separator />

                {selectedFn?.inputs.map((item: any, idx: number) => {
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
          </>
        )}

        {txHash && (
          <div className="overflow-scroll">
            Transaction Hash: <pre>{txHash}</pre>
          </div>
        )}

        {result && (
          <div className="overflow-scroll">
            Result: <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}

        <div className="flex gap-3">
          <Button type="submit" className="w-1/3" variant="outline">
            Clear
          </Button>
          <Button type="submit" className="w-1/3" variant="secondary">
            Simulate
          </Button>
          <Button
            type="submit"
            className="w-1/3"
            onClick={onSubmit}
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send
          </Button>
        </div>
      </form>
    </Form>
  );
}
