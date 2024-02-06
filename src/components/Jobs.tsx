import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

import { supabase } from "../utils/supabase";
import { useEffect } from "react";

export function Jobs() {
  // const supabase = createClient();

  const [contracts, setContracts] = React.useState([]);

  useEffect(() => {
    const fetchContracts = async () => {
      const data = await supabase.from("contracts").select("*");

      // await supabase.from("contracts").insert({
      //   contract_address: "0x123",
      //   creator_address: "0x123",
      //   chain_id: 42,
      //   network_name: "kovan",
      // });

      console.log("CONTRACTS HEY:", data);

      // setContracts(data);
    };

    fetchContracts();
  }, []);

  console.log("CONTRACTS:", contracts);

  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="outline" className="mr-2">
          {/* <Loader2 className="animate-spin mr-2" /> Deploying contract (1) */}
          My contracts (0)
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
