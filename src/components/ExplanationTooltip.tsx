import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ExplanationTooltip({ children }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            onClick={(e) => e.preventDefault()}
            className="h-4 w-4 text-xs p-0 rounded-full"
            size="icon"
          >
            ?
          </Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p>{children}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
