import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { contracts } from "./ContractsForm";

export function ContractSelect() {
  return (
    <Select defaultValue={contracts[0].id}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a contract" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Contract type:</SelectLabel>
          {contracts.map(({ id, label }) => (
            <SelectItem key={id} value={id}>
              {label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
