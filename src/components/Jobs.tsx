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
        <Button size="sm">
          <Loader2 className="animate-spin" /> Deploying contract (1)
        </Button>
      </PopoverTrigger>

      <PopoverContent>
        <ul className="">
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
        </ul>
      </PopoverContent>
    </Popover>
  );
}
