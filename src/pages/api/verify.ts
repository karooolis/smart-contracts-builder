import type { NextApiRequest, NextApiResponse } from "next";

const ETHERSCAN_API_URL = "https://api.etherscan.io/api";
const ACTION = "verifysourcecode";
const API_KEY = "ABN3RTQAYV11BP2EKC2DGUCD7FZF5SW4DJ";
const CODE_FORMAT = "solidity-standard-json-input";
const MODULE = "contract";
const COMPILER = "v0.8.25+commit.b61c2a91";

// TODO: add proper output types
type ResponseData = {};

const fetchTxStatus = async (txHash: string) => {
  const params = new URLSearchParams({
    module: "transaction",
    action: "gettxreceiptstatus",
    txhash: txHash,
    apikey: API_KEY,
  });

  const res = await fetch(`${ETHERSCAN_API_URL}?${params.toString()}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  const data = await res.json();
  return data;
};

const verifyEtherscan = async (
  name: string,
  addr: string,
  chainId: string,
  code: string
) => {
  console.log("code:", code);

  const fetchResponse = await fetch(ETHERSCAN_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      sourcecode: code,
      contractname: name,
      compilerversion: COMPILER,
      apikey: API_KEY,
      action: ACTION,
      codeformat: CODE_FORMAT,
      module: MODULE,
      chainid: chainId,
      contractaddress: addr,
    }),
  });
  const data = await fetchResponse.json();
  return data;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { code, name, addr, chainId, txHash } = req.body;
  const fetchData = await fetchTxStatus(txHash);
  const verifyData = await verifyEtherscan(name, addr, chainId, code);

  return res.status(200).json({
    fetchData,
    verifyData,
  });
}
