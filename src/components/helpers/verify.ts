export type VerifyProps = {
  code: string;
  name: string;
  contractAddress: string;
  chainId: number;
};

export const verify = async ({
  code,
  name,
  contractAddress,
  chainId,
}: VerifyProps) => {
  const response = await fetch("api/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code,
      name,
      contractAddress,
      chainId,
    }),
  });
  const data = await response.json();
  return data;
};
