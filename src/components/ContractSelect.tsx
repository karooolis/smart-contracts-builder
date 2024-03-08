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
import { CONTRACTS } from "@/constants";
import { useStore } from "@/utils/store";

export function ContractSelect() {
  const setContractType = useStore((state) => state.setContractType);
  const contractType = useStore((state) => state.contractType);

  return (
    <Select defaultValue={contractType} onValueChange={setContractType}>
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder="Select a contract" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Contract type:</SelectLabel>
          {CONTRACTS.map(({ id, label, isReady }) => (
            <SelectItem key={id} value={id} disabled={!isReady}>
              {label} {!isReady && "(coming soon)"}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
