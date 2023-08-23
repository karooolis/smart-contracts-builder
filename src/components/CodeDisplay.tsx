import React, { useEffect } from "react";
import Script from "next/script";
import Editor from "@monaco-editor/react";
import { solidity } from "@replit/codemirror-lang-solidity";
import { okaidia } from "@uiw/codemirror-theme-okaidia";
import _ from "lodash";
import { useTheme } from "next-themes";

type Props = {
  value: string;
};

function CodeDisplay({ value }: Props) {
  const { theme } = useTheme();
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
      <Editor
        options={{
          fontSize: 14,
        }}
        defaultLanguage="sol"
        value={formattedCode}
        defaultValue={formattedCode}
        theme={theme === "dark" ? "vs-dark" : "vs-light"}
      />
    </>
  );
}
export default CodeDisplay;
