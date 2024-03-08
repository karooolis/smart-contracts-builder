import { useEffect, useState } from "react";
import _ from "lodash";
import { useTheme } from "next-themes";
import CodeMirror from "@uiw/react-codemirror";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Clipboard, Check } from "lucide-react";
import { solidity } from "@replit/codemirror-lang-solidity";
import { boysAndGirls, tomorrow } from "thememirror";

import { Button } from "@/components/ui/button";
import { NeedHelpDialog } from "@/components/NeedHelpDialog";
import { Deploy } from "@/components/Deploy";
import { useStore } from "@/utils/store";

type Props = {
  name: string;
  value: string;
  contractType: string;
};

function CodeDisplay({ name, contractType }: Props) {
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
      <div className="relative h-full">
        <div className="fixed bottom-6 right-0 z-10">
          {/* <Button size="sm" className="mr-4">
            <Download className="mr-2 h-4 w-4" /> Download
          </Button> */}

          <Deploy
            name={name}
            contract={code}
            contractType={contractType}
          />

          <CopyToClipboard text={code} onCopy={() => setCopied(true)}>
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

        <CodeMirror
          value={code}
          onChange={setCode}
          height="100%"
          theme={
            theme === "dark" || resolvedTheme === "dark"
              ? boysAndGirls
              : tomorrow
          }
          extensions={[solidity]}
        />
      </div>
    </>
  );
}
export default CodeDisplay;
