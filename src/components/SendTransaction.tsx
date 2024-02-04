import * as React from "react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import {
  useWalletClient,
  useAccount,
  useConnect,
  usePublicClient,
} from "wagmi";
import { Clipboard, Check, Send, Download, BadgeHelp } from "lucide-react";
import { Button } from "./ui/button";

// import { Toaster } from "@/components/ui/toaster";
// import { ToastAction } from "@/components/ui/toast";
// import { useToast } from "@/components/ui/use-toast";

import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export function SendTransaction({
  name,
  contract,
}: {
  name: string;
  contract: string;
}) {
  // const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const account = useWalletClient();
  const publicClient = usePublicClient();

  console.log("name:", name);
  console.log("account:", account.data);
  console.log("contract:", contract);

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

      toast("New ERC20 token has been created", {
        description: "Congratulations! You have successfully deployed a new ERC20 token.",
        // action: {
        //   label: "Undo",
        //   onClick: () => console.log("Undo"),
        // },
      });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Toaster position="top-right" closeButton />

      <Button
        size="sm"
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
