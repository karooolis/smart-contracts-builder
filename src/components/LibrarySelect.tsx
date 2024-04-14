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
import { useStore } from "@/utils/store";

export function LibrarySelect() {
  const library = useStore((state) => state.library);
  const setLibrary = useStore((state) => state.setLibrary);

  return (
    <Select defaultValue={library} onValueChange={setLibrary}>
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder="Select a library" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Library:</SelectLabel>
          {LIBRARIES.map(({ id, label }) => (
            <SelectItem key={id} value={id} disabled={id === "solady"}>
              {label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
