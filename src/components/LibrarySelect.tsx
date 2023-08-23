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

export function LibrarySelect() {
  return (
    <Select defaultValue={libraries[0].id}>
      <SelectTrigger className="w-[200px]">
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
