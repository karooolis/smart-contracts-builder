import type { NextApiRequest, NextApiResponse } from "next";
import { compile } from "./helpers/compile";

// TODO: add proper output types
type ResponseData = {
  abi: any;
  bytecode: any;
  input: any;
  output: any;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { name } = req.body;
  const { input, output } = compile(req);

  res.status(200).json({
    abi: output.contracts[`${name}.sol`][name].abi,
    bytecode: output.contracts[`${name}.sol`][name].evm.bytecode.object,
    input: input,
    output: output,
  });
}
