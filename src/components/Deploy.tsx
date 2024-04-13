import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Loader2 } from "lucide-react";
import { useWalletClient, useAccount, usePublicClient } from "wagmi";
import { Send } from "lucide-react";
import { Button } from "./ui/button";
import { truncateEthAddress } from "@/lib/utils";
import { supabase } from "../utils/supabase";

import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { TransactionReceipt } from "viem";
import { useStore } from "@/utils/store";

type Props = {
  name: string;
  contract: string;
  contractType: string;
};

export function Deploy({ name, contract, contractType }: Props) {
  const { deploying, fetchContracts } = useStore(); // TODO: add types
  const setDeploying = useStore((state) => state.setDeploying);
  const { isConnected, chain, address: walletAddress } = useAccount();
  const { openConnectModal } = useConnectModal();
  const account = useWalletClient();
  const publicClient = usePublicClient();
  // const network = useNetwork();

  const network = {}; // TODO: fix later
  const explorerUrl = network.chain?.blockExplorers?.etherscan?.url;

  async function deploy() {
    setDeploying(true);

    try {
      const response = await fetch("api/deploy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, contract }),
      });
      const data = await response.json();

      let inputs = data.abi.find((item: any) => item.type === "constructor");
      inputs = inputs?.inputs;

      const args = [];
      if (inputs.length > 0) {
        if (inputs[0].name === "initialOwner") {
          args.push(account.data?.account.address);
        }
      }

      const hash: string = await account.data?.deployContract({
        abi: data.abi,
        account: account.data?.account,
        bytecode: `0x${data.bytecode}`,
        args: args,
        gas: BigInt(2000000),
      });

      // wait for TX to finish
      const receipt: TransactionReceipt =
        await publicClient.waitForTransactionReceipt({
          hash,
        });

      const contractUrl = `${explorerUrl}/address/${receipt.contractAddress as string}`;
      toast(`${contractType.toUpperCase()} token has been created`, {
        description: `Contract address: ${truncateEthAddress(receipt.contractAddress as string)}`,
        action: {
          label: "Open",
          onClick: () => {
            window.open(contractUrl, "_blank")?.focus();
          },
        },
      });

      await supabase.from("contracts").insert({
        contract_address: receipt.contractAddress,
        contract_name: name,
        contract_type: contractType,
        creator_address: walletAddress,
        // chain_id: network.chain?.id,
        // network_name: network.chain?.name,
        hash: receipt.blockHash,
        explorer_url: contractUrl,
      });

      fetchContracts(walletAddress);
    } catch (error) {
      console.error(error);
    } finally {
      setDeploying(false);
    }
  }

  return (
    <>
      <Toaster position="top-right" duration={10000000} closeButton />

      <Button
        size="sm"
        variant="outline"
        className="mr-4"
        onClick={() => {
          if (!isConnected) {
            if (openConnectModal) {
              openConnectModal();
            }
          } else {
            deploy();
          }
        }}
        disabled={deploying}
      >
        {deploying ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deploying ...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" /> Deploy
          </>
        )}
      </Button>
    </>
  );
}

export default Deploy;
