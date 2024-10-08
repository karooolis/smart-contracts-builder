import { useEffect, useState } from "react";
import _ from "lodash";
import { useTheme } from "next-themes";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Clipboard, Check, Download } from "lucide-react";

import { useStore } from "@/utils/store";
import { Button } from "@/components/ui/button";
import { NeedHelpDialog } from "@/components/NeedHelpDialog";
import { Deploy } from "@/components/Deploy";
import { LiveBlock } from "@/components/LiveBlock";

import Editor from "@monaco-editor/react";

function CodeDisplay() {
  const { theme, resolvedTheme } = useTheme();
  const [copied, setCopied] = useState(false);

  const code = useStore((state) => state.code);
  const setCode = useStore((state) => state.setCode);

  useEffect(() => {
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }, [copied]);

  return (
    <>
      <div className="relative h-full overflow-y-auto">
        <div className="fixed bottom-6 right-8 z-10 flex items-center justify-center">
          <LiveBlock />

          <Deploy name={name} contract={code} />

          <CopyToClipboard text={code} onCopy={() => setCopied(true)}>
            <Button size="sm" variant="outline" className="mr-4">
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Clipboard className="h-4 w-4" />
              )}
            </Button>
          </CopyToClipboard>

          <NeedHelpDialog />
        </div>

        <Editor
          width="100%"
          height="100%"
          language="sol"
          value={code}
          onChange={setCode}
          defaultValue={code}
          theme={
            theme === "dark" || resolvedTheme === "dark"
              ? "hc-black"
              : "vs-light"
          }
        />
      </div>
    </>
  );
}
export default CodeDisplay;
