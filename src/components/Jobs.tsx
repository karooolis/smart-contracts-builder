import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { Loader2, ExternalLink } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Button } from "./ui/button";
import { supabase } from "../utils/supabase";
import { Tables } from "@/types/supabase.types";
import { useStore } from "@/utils/store";

export function Jobs() {
  const { deploying, contracts, fetchContracts } = useStore();
  // const [contracts, setContracts] = useState<Tables<"contracts">[]>([]);
  const { address: accountAddress } = useAccount();

  useEffect(() => {
    // const fetchContracts = async () => {
    //   const { data, error } = await supabase
    //     .from("contracts")
    //     .select()
    //     .eq("creator_address", accountAddress);

    //   if (data?.length) {
    //     setContracts(data);
    //   }
    // };

    fetchContracts(accountAddress);
  }, [fetchContracts, accountAddress]);

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          variant="outline"
          className="mr-2"
          disabled={deploying}
          asChild={true}
        >
          {deploying ? (
            <span>
              <Loader2 className="animate-spin mr-2" /> Deploying ...
            </span>
          ) : (
            <>My contracts ({contracts.length})</>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[320px] overflow-y-scroll max-h-[350px]">
        {contracts.length > 0 ? (
          <ul>
            {contracts.map((contract: Tables<"contracts">) => {
              return (
                <li
                  key={contract.contract_address}
                  className="flex justify-between items-center border-b py-2"
                >
                  <p>
                    {contract.contract_type.toUpperCase()}:{" "}
                    {contract.contract_name}
                  </p>

                  <div className="flex justify-between items-center gap-x-2">
                    <Badge variant="outline">Unverified</Badge>
                    <a
                      href={contract.explorer_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm"
                    >
                      <ExternalLink className="h-4" />
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <>Your deployed contracts will appear here.</>
        )}
      </PopoverContent>
    </Popover>
  );
}
