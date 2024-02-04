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

export function SendTransaction({
  name,
  contract,
}: {
  name: string;
  contract: string;
}) {
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
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      size="sm"
      className="mr-4"
      onClick={() => {
        if (!isConnected) {
          return openConnectModal();
        }

        sendTransaction();
      }}
      disabled={loading}
    >
      <Send className="mr-2 h-4 w-4" />
      {loading ? "Deploying..." : "Deploy"}

      {/* {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>} */}
    </Button>
  );
}

export default SendTransaction;
