import React, { useEffect } from "react";
import Script from "next/script";
import CodeMirror from "@uiw/react-codemirror";
import { solidity } from "@replit/codemirror-lang-solidity";
import { okaidia } from "@uiw/codemirror-theme-okaidia";
import _ from "lodash";

type Props = {
  value: string;
};

function CodeDisplay({ value }: Props) {
  const [formattedCode, setFormattedCode] = React.useState(value);

  // format code on change
  useEffect(() => {
    if (window.prettier && value) {
      const formattedCode = prettier.format(value, {
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
        height="calc(100vh - 4rem)"
        theme={okaidia}
        extensions={[solidity]}
        readOnly
      />
    </>
  );
}
export default CodeDisplay;
