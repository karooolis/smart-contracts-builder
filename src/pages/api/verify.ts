import type { NextApiRequest, NextApiResponse } from "next";

const ETHERSCAN_API_URL = "https://api.etherscan.io/api";
const ACTION = "verifysourcecode";
const API_KEY = "ABN3RTQAYV11BP2EKC2DGUCD7FZF5SW4DJ";
const CODE_FORMAT = "solidity-standard-json-input";
const MODULE = "contract";
const COMPILER = "v0.8.25+commit.b61c2a91";

// TODO: add proper output types
type ResponseData = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { code, name, contractAddress, chainId } = req.body;

  let formData = new FormData();
  formData.append("sourcecode", code);
  formData.append("contractname", name);
  formData.append("compilerversion", COMPILER);
  formData.append("apikey", API_KEY);
  formData.append("action", ACTION);
  formData.append("codeformat", CODE_FORMAT);
  formData.append("module", MODULE);
  formData.append("chainid", chainId);
  formData.append("contractaddress", contractAddress);

  const fetchResponse = await fetch(ETHERSCAN_API_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: formData,
  });
  const data = await fetchResponse.json();
  return res.status(200).json(data);
}
