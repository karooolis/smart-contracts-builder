import * as React from "react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import {
  useWalletClient,
  useAccount,
  useConnect,
  usePublicClient,
  useNetwork,
} from "wagmi";
import { Clipboard, Check, Send, Download, BadgeHelp } from "lucide-react";
import { Button } from "./ui/button";
import { truncateEthAddress } from "@/lib/utils";

// import { Toaster } from "@/components/ui/toaster";
// import { ToastAction } from "@/components/ui/toast";
// import { useToast } from "@/components/ui/use-toast";

import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

type Props = {
  name: string;
  contract: string;
  contractType: string;
};

export function SendTransaction({ name, contract, contractType }: Props) {
  // const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const account = useWalletClient();
  const publicClient = usePublicClient();
  const network = useNetwork();

  const explorerUrl = network.chain?.blockExplorers?.etherscan?.url;

  console.log("name:", name);
  console.log("account:", account.data);
  console.log("contract:", contract);
  console.log("network:", explorerUrl);

  async function sendTransaction() {
    setLoading(true);

    try {
      const response = await fetch("api/hello", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, contract }),
      });
      const data = await response.json();

      console.log("DATA RESPONSE:", data);

      let inputs = data.abi.find((item: any) => item.type === "constructor");
      inputs = inputs?.inputs;
      console.log("INPUTS:", inputs);

      const args = [];
      if (inputs.length > 0) {
        if (inputs[0].name === "initialOwner") {
          args.push(account.data?.account.address);
        }
      }

      console.log("args", args);

      const hash = await account.data?.deployContract({
        abi: data.abi,
        account: account.data?.account,
        bytecode: `0x${data.bytecode}`,
        args: args,
        gas: BigInt(2000000),
      });

      console.log("HASH:", hash);

      // wait for TX to finish
      const receipt = await publicClient.waitForTransactionReceipt({
        hash,
      });

      console.log("RECEIPT:", receipt);

      // blockHash - "0x2fc352900e9bb3ee37d48600a6e34536747738a01b9cea96f80c7d9276a948bc"
      // contractAddress - "0x3240814606781b0ee5a688548b6ae1adedb03738"

      // block explorer url for the connected chain
      const url = toast(`${contractType.toUpperCase()} token has been created`, {
        description: `Contract address: ${truncateEthAddress(receipt.contractAddress)}`,
        action: {
          label: "Open",
          onClick: () => {
            window
              .open(
                `${explorerUrl}/address/${receipt.contractAddress}`,
                "_blank"
              )
              .focus();
          },
        },
      });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
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
            return openConnectModal();
          }

          sendTransaction();
        }}
      >
        <Send className="mr-2 h-4 w-4" />
        Deploy
        {/* {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>} */}
      </Button>
    </>
  );
}

export default SendTransaction;
