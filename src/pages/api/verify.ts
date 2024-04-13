import type { NextApiRequest, NextApiResponse } from "next";

const ETHERSCAN_API_URL = "https://api.etherscan.io/api";
const ACTION = "verifysourcecode";
const API_KEY = "ABN3RTQAYV11BP2EKC2DGUCD7FZF5SW4DJ";
const CODE_FORMAT = "solidity-standard-json-input";
const MODULE = "contract";

// TODO: add proper output types
type ResponseData = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { code, name, compiler, contractAddress, chainId } = req.body;

  let formData = new FormData();
  formData.append("sourcecode", code);
  formData.append("contractname", name);
  formData.append("compilerversion", compiler);
  formData.append("apikey", API_KEY);
  formData.append("action", ACTION);
  formData.append("codeformat", CODE_FORMAT);
  formData.append("module", MODULE);
  formData.append("chainid", chainId);
  formData.append("contractaddress", contractAddress);

  try {
    const fetchResponse = await fetch(ETHERSCAN_API_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: formData,
    });
    const data = await fetchResponse.json();
    return res.status(200).json({
      ok: true,
      message: "Successfully verified contract",
      data: data,
    });
  } catch (e) {
    return res.status(200).json({
      ok: false,
      message: "Failed to verify contract",
      error: e,
    });
  }
}
