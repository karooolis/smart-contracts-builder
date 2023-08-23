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

export function ContractSelect({ onValueChange }) {
  return (
    <Select defaultValue={contracts[0].id} onValueChange={onValueChange}>
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder="Select a contract" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Contract type:</SelectLabel>
          {contracts.map(({ id, label, isReady }) => (
            <SelectItem key={id} value={id} disabled={!isReady}>
              {label} {!isReady && "(coming soon)"}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
