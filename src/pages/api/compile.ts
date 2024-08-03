import type { NextApiRequest, NextApiResponse } from "next";
import { compile } from "./helpers/compile";

// TODO: add proper output types
export type ResponseData = {
  abi: any;
  bytecode: any;
  input: any;
  output: any;
  error?: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const { name, contract } = req.body;
    const { input, output } = compile(name, contract);
  
    console.log(input);
    console.log(output);

    if (output.errors) {
      throw new Error(output.errors[0].formattedMessage);
    }
  
    res.status(200).json({
      abi: output.contracts[`${name}.sol`][name].abi,
      bytecode: output.contracts[`${name}.sol`][name].evm.bytecode.object,
      input: input,
      output: output,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
