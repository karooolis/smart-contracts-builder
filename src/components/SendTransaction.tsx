import { useWalletClient } from "wagmi";

export function SendTransaction({
  name,
  contract,
}: {
  name: string;
  contract: string;
}) {
  const account = useWalletClient();

  console.log("name:", name);

  async function sendTransaction() {
    const response = await fetch("api/hello", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, contract }),
    });
    const data = await response.json();

    console.log("DATA RESPONSE:", data);

    await account.data?.deployContract({
      abi: data.abi,
      account: account.data?.account,
      bytecode: `0x${data.bytecode}`,
      args: [],
      gas: BigInt(2000000),
    });
  }

  return (
    <div>
      <button onClick={() => sendTransaction()}>Deploy</button>
      {/* {isLoading && <div>Check Wallet</div>}
      {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>} */}
    </div>
  );
}

export default SendTransaction;
