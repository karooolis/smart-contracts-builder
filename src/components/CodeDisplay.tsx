import React, { useEffect } from "react";
import Script from "next/script";
import Editor, { useMonaco } from "@monaco-editor/react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import _ from "lodash";
import { useTheme } from "next-themes";
import { Clipboard, Check } from "lucide-react";

import nightOwl from "../themes/night-owl.json";
import githubDark from "../themes/github-dark.json";

import { Button } from "@/components/ui/button";

type Props = {
  value: string;
};

function CodeDisplay({ value }: Props) {
  const { theme, resolvedTheme } = useTheme();
  const monaco = useMonaco();
  const editorRef = React.useRef(null);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }, [copied]);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  const [formattedCode, setFormattedCode] = React.useState(value);

  function setEditorTheme(monaco: any) {
    monaco.editor.defineTheme("night-owl", nightOwl);
    monaco.editor.defineTheme("github-dark", githubDark);
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

      <div className="relative h-full">
        <CopyToClipboard text={formattedCode} onCopy={() => setCopied(true)}>
          <Button size="sm" className="absolute bottom-6 right-8 z-10">
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" /> Copied!
              </>
            ) : (
              <>
                <Clipboard className="mr-2 h-4 w-4" /> Copy
              </>
            )}
          </Button>
        </CopyToClipboard>

        <Editor
          options={{
            fontSize: 14,
            readOnly: true,
          }}
          defaultLanguage="sol"
          value={formattedCode}
          defaultValue={formattedCode}
          theme={theme === "dark" || resolvedTheme === "dark" ? "hc-black" : "vs-light"}
          beforeMount={setEditorTheme}
          onMount={handleEditorDidMount}
        />
      </div>
    </>
  );
}
export default CodeDisplay;
