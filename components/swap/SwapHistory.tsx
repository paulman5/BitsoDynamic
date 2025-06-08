import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export type SwapHistoryItem = {
  id: string
  type: string
  from: string
  to: string
  amount: string
  status: string
  timestamp: string
  gasSponsored: boolean
}

export type SwapHistoryProps = {
  history: SwapHistoryItem[]
  isLoading: boolean
  onRefresh: () => void
  refreshing: boolean
}

export function SwapHistory({
  history,
  isLoading,
  onRefresh,
  refreshing,
}: SwapHistoryProps) {
  return (
    <Card className="rounded-2xl shadow-lg bg-white/80 backdrop-blur-xl border-0">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Transaction History
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            className="rounded-full hover:bg-blue-50"
          >
            <RefreshCw
              className={`w-4 h-4 transition-transform duration-700 ${refreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">
            <Loader2 className="w-5 h-5 mx-auto animate-spin mb-2" />
            <div className="text-sm">Fetching transactions...</div>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-sm">No transactions yet</div>
          </div>
        ) : (
          <>
            {history.map((tx) => (
              <div
                key={tx.id}
                className="p-4 bg-white/70 rounded-xl flex flex-col gap-1 shadow-sm hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">
                      {(() => {
                        const token = [
                          { symbol: "mUSDC", icon: "💵" },
                          { symbol: "mPEPE", icon: "🐸" },
                        ].find((t) => t.symbol === tx.from)
                        return token ? token.icon : ""
                      })()}
                    </span>
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        tx.status === "success"
                          ? "bg-green-500"
                          : tx.status === "pending"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    ></div>
                    <span className="font-medium text-sm text-gray-900">
                      {tx.type}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 p-0 rounded-full hover:bg-blue-100"
                    onClick={() =>
                      window.open(
                        `https://sepolia.etherscan.io/tx/${tx.id}`,
                        "_blank"
                      )
                    }
                  >
                    <ExternalLink className="w-4 h-4 text-blue-600" />
                  </Button>
                </div>
                <div className="text-xs text-gray-600 flex flex-col gap-0.5">
                  <div>
                    {tx.from} {tx.to && `→ ${tx.to}`}
                  </div>
                  <div>Amount: {tx.amount}</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-gray-500">{tx.timestamp}</span>
                    {tx.gasSponsored && (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-green-50 text-green-700 rounded-md px-2 py-0.5"
                      >
                        Gas Sponsored
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  )
}
