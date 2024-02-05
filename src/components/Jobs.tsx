import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

export function Jobs() {
  return (
    <Popover>
      <PopoverTrigger>
        <Button size="sm" className="mr-2">
          {/* <Loader2 className="animate-spin mr-2" /> Deploying contract (1) */}
          Contracts (0)
        </Button>
      </PopoverTrigger>

      <PopoverContent>
        Your deployed contracts will appear here.

        {/* <ul className="">
          <li className="border-b pb-3">
            <a href="#" className="block text-sm">
              ERC20: Token 12123
            </a>
          </li>

          <li className="border-b py-3">
            <a href="#" className="block text-sm">
              ERC20: Token 12123
            </a>
          </li>

          <li className="pt-3">
            <a href="#" className="block text-sm">
              ERC20: Token 12123
            </a>
          </li>
        </ul> */}
      </PopoverContent>
    </Popover>
  );
}
