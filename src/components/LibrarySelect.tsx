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

import { libraries } from "./ContractsForm";

export function LibrarySelect({ onValueChange }) {
  return (
    <Select defaultValue={libraries[0].id} onValueChange={onValueChange}>
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder="Select a library" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Library:</SelectLabel>
          {libraries.map(({ id, label }) => (
            <SelectItem key={id} value={id}>
              {label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
