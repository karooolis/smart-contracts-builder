import React, { useEffect } from "react";
import Editor from "@monaco-editor/react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import _ from "lodash";
import { useTheme } from "next-themes";
import { Clipboard, Check } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  value: string;
};

function CodeDisplay({ value }: Props) {
  const { theme, resolvedTheme } = useTheme();
  const editorRef = React.useRef(null);
  const [copied, setCopied] = React.useState(false);
  const [formattedCode, setFormattedCode] = React.useState(value);

  React.useEffect(() => {
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }, [copied]);

  // format code on change
  // TODO: fix prettier
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

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  return (
    <>
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
            fontSize: 13,
            readOnly: true,
          }}
          defaultLanguage="sol"
          value={formattedCode}
          defaultValue={formattedCode}
          theme={
            theme === "dark" || resolvedTheme === "dark"
              ? "hc-black"
              : "vs-light"
          }
          onMount={handleEditorDidMount}
        />
      </div>
    </>
  );
}
export default CodeDisplay;
