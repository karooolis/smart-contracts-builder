import React, { useEffect } from "react";
import Script from "next/script";
import Editor, { useMonaco } from "@monaco-editor/react";
import _ from "lodash";
import { useTheme } from "next-themes";

import nightOwl from "../themes/night-owl.json";

type Props = {
  value: string;
};

function CodeDisplay({ value }: Props) {
  const { theme } = useTheme();
  const monaco = useMonaco();

  const editorRef = React.useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  const [formattedCode, setFormattedCode] = React.useState(value);

  function setEditorTheme(monaco: any) {
    monaco.editor.defineTheme("night-owl", nightOwl);
  }

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
          readOnly: true,
        }}
        defaultLanguage="sol"
        value={formattedCode}
        defaultValue={formattedCode}
        theme={theme === "dark" ? "night-owl" : "vs-light"}
        beforeMount={setEditorTheme}
        onMount={handleEditorDidMount}
      />
    </>
  );
}
export default CodeDisplay;
