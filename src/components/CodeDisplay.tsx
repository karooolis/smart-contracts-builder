import React, { useEffect } from "react";
import Script from "next/script";
import CodeMirror from "@uiw/react-codemirror";
import { solidity } from "@replit/codemirror-lang-solidity";
import { okaidia } from "@uiw/codemirror-theme-okaidia";

type Props = {
  value: string;
};

function CodeDisplay({ value }: Props) {
  const [formattedCode, setFormattedCode] = React.useState("");

  // format code on change
  useEffect(() => {
    if (window.prettier) {
      const originalCode = value;
      const formattedCode = prettier.format(originalCode, {
        parser: "solidity-parse",
        plugins: window.prettierPlugins,
      });

      formattedCode.then(function (result) {
        setFormattedCode(result);
      });
    }
  }, [value]);

  return (
    <>
      <Script src="https://unpkg.com/prettier@latest" />
      <Script src="https://unpkg.com/prettier-plugin-solidity@latest" />

      <CodeMirror
        value={formattedCode}
        height="500px"
        theme={okaidia}
        extensions={[solidity]}
        readOnly
      />
    </>
  );
}
export default CodeDisplay;
