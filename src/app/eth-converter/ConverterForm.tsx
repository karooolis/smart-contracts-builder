"use client";

import React from "react";
import _ from "lodash";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formatUnits, parseUnits } from "viem";
import { useSearchParams } from "next/navigation";
import { CopyToClipboard } from "@/components/CopyToClipboard";

// monkey patch BigInt - https://github.com/GoogleChromeLabs/jsbi/issues/30#issuecomment-1006086291
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

const formSchema = z.object({
  wei: z.string().optional(),
  kwei: z.string().optional(),
  mwei: z.string().optional(),
  gwei: z.string().optional(),
  szabo: z.string().optional(),
  finney: z.string().optional(),
  ether: z.string().optional(),
});

const FIELDS = [
  "wei",
  "kwei",
  "mwei",
  "gwei",
  "szabo",
  "finney",
  "ether",
] as const;

const PROPERTIES = {
  wei: {
    decimals: 0,
  },
  kwei: {
    decimals: 3,
  },
  mwei: {
    decimals: 6,
  },
  gwei: {
    decimals: 9,
  },
  szabo: {
    decimals: 12,
  },
  finney: {
    decimals: 15,
  },
  ether: {
    decimals: 18,
  },
};

export function ConverterForm() {
  const searchParams = useSearchParams();
  const initialWei = searchParams?.get("wei") || "1000000000000000000";
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      wei: initialWei,
      kwei: formatUnits(BigInt(initialWei), 3).toString(),
      mwei: formatUnits(BigInt(initialWei), 6).toString(),
      gwei: formatUnits(BigInt(initialWei), 9).toString(),
      szabo: formatUnits(BigInt(initialWei), 12).toString(),
      finney: formatUnits(BigInt(initialWei), 15).toString(),
      ether: formatUnits(BigInt(initialWei), 18).toString(),
    },
  });

  const onChange = (
    changedField: (typeof FIELDS)[number],
    evt: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = evt.target.value;
    const weiValue = parseUnits(
      value,
      PROPERTIES[changedField].decimals,
    ).toString();

    for (const field of FIELDS) {
      if (field !== changedField) {
        const convertedValue = formatUnits(
          BigInt(weiValue),
          PROPERTIES[field].decimals,
        ).toString();

        form.setValue(field, convertedValue);
      }
    }
  };

  return (
    <Form {...form}>
      <form className="relative w-[600px] rounded-md border p-4 shadow">
        <CopyToClipboard
          onCopy={() => {
            const weiValue = form.getValues("wei");
            if (weiValue) {
              const newSearchParams = new URLSearchParams(searchParams ?? {});
              newSearchParams.set("wei", weiValue);
              navigator.clipboard.writeText(
                `${window.location.origin}${window.location.pathname}?${newSearchParams.toString()}`,
              );
            }
          }}
        />

        <div className="space-y-8 pt-3">
          {FIELDS.map((fieldName) => {
            return (
              <FormField
                key={fieldName}
                control={form.control}
                name={fieldName}
                render={({ field }) => (
                  <FormItem
                    onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
                      onChange(fieldName, evt);
                    }}
                  >
                    <FormLabel className="w-[80px] flex-shrink-0 font-semibold">
                      {fieldName} (
                      {fieldName === "wei" ? 1 : PROPERTIES[fieldName].decimals}
                      )
                    </FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          })}
        </div>
      </form>
    </Form>
  );
}
