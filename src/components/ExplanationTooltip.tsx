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
            className="h-4 w-4 rounded-full p-0 text-xs"
            size="icon"
          >
            ?
          </Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs font-normal">
          <p>{children}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
