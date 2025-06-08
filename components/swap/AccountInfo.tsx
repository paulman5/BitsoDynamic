import { Button } from "@/components/ui/button"
import { Check, Copy } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export type AccountInfoProps = {
  address?: string
  onCopy: () => void
  copySuccess: boolean
}

export function AccountInfo({
  address,
  onCopy,
  copySuccess,
}: AccountInfoProps) {
  if (!address) return null
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600 bg-white/70 rounded-xl px-3 py-1 border border-blue-100 shadow-sm mt-2 max-w-full">
      <span className="font-semibold text-gray-800">Smart Account:</span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <code
              className="bg-blue-50 rounded-lg px-2 py-1 text-xs font-mono text-blue-700 border border-blue-200 select-all max-w-[140px] truncate cursor-pointer"
              style={{ display: "inline-block" }}
            >
              {address}
            </code>
          </TooltipTrigger>
          <TooltipContent side="top">{address}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCopy}
              className="rounded-full hover:bg-blue-100"
            >
              {copySuccess ? (
                <Check className="w-3 h-3 text-green-600" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            {copySuccess ? "Copied!" : "Copy address"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
