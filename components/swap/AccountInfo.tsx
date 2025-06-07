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
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <span>Smart Account:</span>
      <code className="bg-gray-100 rounded text-xs">{address}</code>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={onCopy}>
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
