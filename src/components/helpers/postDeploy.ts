import { truncateEthAddress } from "@/lib/utils";
import { supabase } from "@/utils/supabase";
import { toast } from "sonner";
import { TransactionReceipt } from "viem";

type DeployProps = any; // TODO: add types

export const postDeploy = async ({
  data,
  name,
  account,
  publicClient,
  explorerUrl,
  contractType,
  walletAddress,
  chain,
}: DeployProps) => {
  let inputs = data.abi.find((item: any) => item.type === "constructor");
  inputs = inputs?.inputs;

  const args = [];
  if (inputs.length > 0) {
    if (inputs[0].name === "initialOwner") {
      args.push(account.data?.account.address);
    }
  }

  const hash: `0x${string}` | undefined = await account.data?.deployContract({
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
    chain_id: chain?.id,
    network_name: chain?.name,
    hash: receipt.blockHash,
    explorer_url: contractUrl,
    input: data.input,
  });

  return receipt;
};
