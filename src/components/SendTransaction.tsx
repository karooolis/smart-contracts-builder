import { parseEther } from "viem";
import { useSendTransaction, usePrepareSendTransaction } from "wagmi";

export function SendTransaction() {
  const { data, isLoading, isSuccess, sendTransaction } = useSendTransaction({
    to: "0xe1f2d038BC3d6405db168A906dD994Cb590e3A14",
    value: parseEther("0.01"),
  });

  return (
    <div>
      <button onClick={() => sendTransaction()}>Send Transaction</button>
      {isLoading && <div>Check Wallet</div>}
      {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
    </div>
  );
}

export default SendTransaction;
