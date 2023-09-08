import { useWalletClient } from "wagmi";

// import Contract from "../../contracts/artifacts/contracts/MockERC20.sol/MyToken.json";

export function SendTransaction() {
  const account = useWalletClient();

  async function sendTransaction() {
    const response = await fetch("api/hello");
    const data = await response.json();
    console.log(data);

    await account.data?.deployContract({
      abi: data.abi,
      account: account.data?.account,
      bytecode: `0x${data.bytecode}`,
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
