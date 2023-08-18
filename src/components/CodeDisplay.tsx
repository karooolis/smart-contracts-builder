import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { solidity } from "@replit/codemirror-lang-solidity";
import { okaidia } from "@uiw/codemirror-theme-okaidia";

type Props = {
  value: string;
}

function CodeDisplay({ value }: Props) {
  return (
    <CodeMirror
      value={value}
      height="500px"
      theme={okaidia}
      extensions={[solidity]}
      readOnly
    />
  );
}
export default CodeDisplay;
