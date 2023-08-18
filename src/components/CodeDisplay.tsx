import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { solidity } from "@replit/codemirror-lang-solidity";
import { okaidia } from "@uiw/codemirror-theme-okaidia";

function CodeDisplay({ value }) {
  // const onChange = React.useCallback((value, viewUpdate) => {
  //   console.log("value:", value);
  // }, []);

  return (
    <CodeMirror
      value={value}
      height="500px"
      theme={okaidia}
      extensions={[solidity]}
      readOnly
      // onChange={onChange}
    />
  );
}
export default CodeDisplay;
