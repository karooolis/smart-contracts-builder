import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Loader2 } from "lucide-react";
import { useWalletClient, useAccount, usePublicClient } from "wagmi";
import { Send } from "lucide-react";
import { Button } from "./ui/button";
import { Toaster } from "@/components/ui/sonner";
import { useStore } from "@/utils/store";
import { compile } from "./helpers/compile";
import { deploy as deployContracts } from "./helpers/deploy";

type Props = {
  name: string;
  contract: string;
};

export function Deploy({ contract }: Props) {
  const { optionsForm, contractType, deploying, fetchContracts } = useStore(); // TODO: add types
  const setDeploying = useStore((state) => state.setDeploying);
  const { isConnected, chain, address: walletAddress } = useAccount();
  const { openConnectModal } = useConnectModal();
  const account = useWalletClient();
  const publicClient = usePublicClient();
  const explorerUrl = chain?.blockExplorers?.default?.url;
  const name = optionsForm?.watch("name");

  async function deploy() {
    setDeploying(true);

    try {
      const data = await compile({ name, contract });
      await deployContracts({
        data,
        name,
        account,
        publicClient,
        explorerUrl,
        contractType,
        walletAddress,
        chain,
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
