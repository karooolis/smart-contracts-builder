import { useEffect } from "react";
import { useAccount } from "wagmi";
import { ExternalLink } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Button } from "./ui/button";
import { Tables } from "@/types/supabase";
import { useStore } from "@/utils/store";
import { postUpdate } from "@/components/helpers/postUpdate";
import { cn } from "@/lib/utils";

export function Jobs() {
  const { deploying, contracts, fetchContracts } = useStore();
  const { address: accountAddress } = useAccount();

  useEffect(() => {
    fetchContracts(accountAddress);
  }, [fetchContracts, accountAddress]);

  const verifyContract = async (contract: Tables<"contracts">) => {
    try {
      const name = contract.contract_name;
      const response = await fetch("api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: contract.input,
          name: `${name}.sol:${name}`,
          addr: contract.contract_address,
          chainId: contract.chain_id,
        }),
      });
      const data = await response.json();

      if (data.verifyData.message === "OK") {
        await postUpdate(contract.id, {
          verified: true,
        });
      }

      return data;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          variant="outline"
          className="mr-2"
          disabled={deploying}
          asChild={true}
        >
          <>My contracts ({contracts?.length})</>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="max-h-[350px] w-[320px] overflow-y-scroll">
        {contracts?.length > 0 ? (
          <ul>
            {contracts.map((contract: Tables<"contracts">) => {
              return (
                <li
                  key={contract.contract_address}
                  className="flex items-center justify-between border-b py-2"
                >
                  <p>
                    {contract.contract_type?.toUpperCase()}:{" "}
                    {contract.contract_name}
                  </p>

                  <div className="flex items-center justify-between gap-x-2">
                    <Badge
                      role="button"
                      variant="outline"
                      className={cn("cursor-pointer", {
                        "bg-lime-300": contract.verified,
                      })}
                      onClick={() => {
                        if (contract.verified) {
                          if (
                            typeof window !== "undefined" &&
                            contract?.explorer_url
                          ) {
                            window
                              .open(`${contract.explorer_url}#code`, "_blank")
                              ?.focus();
                          }
                        } else {
                          verifyContract(contract);
                        }
                      }}
                    >
                      {contract.verified ? "Verified" : "Unverified"}
                    </Badge>
                    <a
                      href={contract.explorer_url as string}
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
