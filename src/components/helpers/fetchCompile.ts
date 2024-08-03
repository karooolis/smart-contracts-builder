import ky from "ky";
import type { ResponseData } from "@/pages/api/compile";

type CompileProps = {
  name: string;
  contract: string;
};

export const fetchCompile = async ({
  name,
  contract,
}: CompileProps): Promise<ResponseData> => {
  const response = await fetch("api/compile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, contract }),
  });

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error);
  }
  
  return data;
};
