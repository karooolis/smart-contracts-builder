export type VerifyProps = {
  code: string;
  name: string;
  addr: string;
  chainId: number;
};

export const verify = async ({ code, name, addr, chainId }: VerifyProps) => {
  const response = await fetch("api/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code,
      name,
      addr,
      chainId,
    }),
  });
  const data = await response.json();
  return data;
};
