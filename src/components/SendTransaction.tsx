import { parseEther } from "viem";
import { useSendTransaction, useNetwork, useWalletClient } from "wagmi";

import Contract from "../../contracts/artifacts/contracts/MockERC20.sol/MyToken.json";

export function SendTransaction() {
  const account = useWalletClient();


  async function sendTransaction() {
    await account.data?.deployContract({
      abi: Contract.abi,
      account: account.data?.account,
      bytecode: Contract.bytecode,
    });
  }

  return (
    <div>
      <button onClick={() => sendTransaction()}>Send Transaction</button>
      {/* {isLoading && <div>Check Wallet</div>}
      {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>} */}
    </div>
  );
}

export default SendTransaction;
