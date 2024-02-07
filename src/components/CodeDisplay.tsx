import React, { useEffect } from "react";
import Editor from "@monaco-editor/react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import _ from "lodash";
import { useTheme } from "next-themes";
import { Clipboard, Check, Send, Download, BadgeHelp } from "lucide-react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { solidity } from "@replit/codemirror-lang-solidity";

import prettier from "prettier/standalone";
import solidityPlugin from "prettier-plugin-solidity/standalone";
import { boysAndGirls, tomorrow } from "thememirror";

import { Button } from "@/components/ui/button";
import { NeedHelpDialog } from "@/components/NeedHelpDialog";

import { SendTransaction } from "@/components/SendTransaction";
import { useAccount, useConnect } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";

type Props = {
  name: string;
  value: string;
  contractType: string;
};

function CodeDisplay({ name, value, contractType }: Props) {
  const { theme, resolvedTheme } = useTheme();
  const editorRef = React.useRef(null);
  const [copied, setCopied] = React.useState(false);

  const [actualValue, setActualValue] = React.useState(value);
  const [formattedCode, setFormattedCode] = React.useState(actualValue);
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  React.useEffect(() => {
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }, [copied]);

  useEffect(() => {
    setActualValue(value);
  }, [value]);

  // format code on change
  // TODO: fix prettier

  async function formatCode() {
    const formattedCode = prettier.format(value, {
      parser: "solidity-parse",
      plugins: [solidityPlugin],
    });

    formattedCode.then(function (result) {
      setFormattedCode(result);
    });
  }

  useEffect(() => {
    const formatCode = async () => {
      const formattedCode = await prettier.format(value, {
        parser: "solidity-parse",
        plugins: [solidityPlugin],
      });

      setFormattedCode(formattedCode);
    };

    formatCode();
  }, [value]);

  return (
    <>
      <div className="relative h-full">
        <div className="fixed bottom-6 right-0 z-10">
          {/* <Button size="sm" className="mr-4">
            <Download className="mr-2 h-4 w-4" /> Download
          </Button> */}

          <SendTransaction
            name={name}
            contract={formattedCode}
            contractType={contractType}
          />

          <CopyToClipboard text={formattedCode} onCopy={() => setCopied(true)}>
            <Button size="sm" variant="outline" className="mr-4">
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

          <NeedHelpDialog />
        </div>

        {/* <Editor
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
        /> */}

        <CodeMirror
          value={formattedCode}
          onChange={(newCode) => {
            console.log("newCode", newCode);

            setActualValue(newCode);
          }}
          height="100%"
          theme={
            theme === "dark" || resolvedTheme === "dark"
              ? boysAndGirls
              : tomorrow
          }
          extensions={[solidity]}
          // extensions={[javascript({ jsx: true })]}
          // onChange={() => {}}
        />
      </div>
    </>
  );
}
export default CodeDisplay;
