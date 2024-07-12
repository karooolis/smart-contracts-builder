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

export function ConverterForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      wei: "1000000000000000000",
      kwei: "1000000000000000",
      mwei: "1000000000000",
      gwei: "1000000000",
      szabo: "1000000",
      finney: "1000",
      ether: "1",
    },
  });

  const onChange = (name: string, evt: React.ChangeEvent<HTMLInputElement>) => {
    console.log(name, evt.target.value);
  };

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
      decimals: 1,
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

  return (
    <Form {...form}>
      <form className="w-[568px] space-y-8 rounded-md border p-4 shadow">
        {FIELDS.map((fieldName) => {
          return (
            <div
              key={fieldName}
              className="flex items-center justify-center gap-4"
            >
              <FormLabel className="flex-shrink-0 w-[80px]">
                {fieldName} ({PROPERTIES[fieldName].decimals})
              </FormLabel>

              <FormField
                control={form.control}
                name={fieldName}
                render={({ field }) => (
                  <FormItem
                    onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
                      onChange(fieldName, evt);
                    }}
                  >
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={fieldName}
                render={({ field }) => (
                  <FormItem
                    onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
                      onChange(fieldName, evt);
                    }}
                  >
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={fieldName}
                render={({ field }) => (
                  <FormItem
                    onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
                      onChange(fieldName, evt);
                    }}
                  >
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          );
        })}
      </form>
    </Form>
  );
}
