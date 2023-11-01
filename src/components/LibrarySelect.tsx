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
import { LIBRARIES } from "@/constants";

export function LibrarySelect({ onValueChange }) {
  return (
    <Select defaultValue={LIBRARIES[0].id} onValueChange={onValueChange}>
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder="Select a library" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Library:</SelectLabel>
          {LIBRARIES.map(({ id, label, isReady }) => (
            <SelectItem
              key={id}
              value={id}
              disabled={!isReady}
            >
              {label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
