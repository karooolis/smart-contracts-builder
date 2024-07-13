import { useState } from "react";
import { Check, Clipboard } from "lucide-react";

type Props = {
  onCopy: () => void;
};

export function CopyToClipboard({ onCopy }: Props) {
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <button
      type="button"
      className="absolute right-4 top-4 z-10 inline-flex h-7 w-7 items-center justify-center whitespace-nowrap rounded-md border border-input bg-background text-sm font-medium text-foreground opacity-100 shadow-sm transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
      onClick={() => {
        onCopy();

        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
        }, 2000);
      }}
    >
      <span className="sr-only">Copy</span>
      {!showSuccess && <Clipboard className="h-3.5 w-3.5" />}
      {showSuccess && <Check className="h-3.5 w-3.5" />}
    </button>
  );
}
