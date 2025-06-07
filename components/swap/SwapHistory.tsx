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
    <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Transaction History</CardTitle>
          <Button variant="ghost" size="sm" onClick={onRefresh}>
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
              <div key={tx.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        tx.status === "success"
                          ? "bg-green-500"
                          : tx.status === "pending"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    ></div>
                    <span className="font-medium text-sm">{tx.type}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() =>
                      window.open(
                        `https://sepolia.etherscan.io/tx/${tx.id}`,
                        "_blank"
                      )
                    }
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>
                    {tx.from} {tx.to && `→ ${tx.to}`}
                  </div>
                  <div>Amount: {tx.amount}</div>
                  <div className="flex items-center justify-between">
                    <span>{tx.timestamp}</span>
                    {tx.gasSponsored && (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-green-50 text-green-700"
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
