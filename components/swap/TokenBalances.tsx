import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw } from "lucide-react"

export type TokenBalance = {
  symbol: string
  icon: string
  formatted: string
}

export type TokenBalancesProps = {
  balances: TokenBalance[]
  isLoading: boolean
  onRefresh: () => void
  refreshing: boolean
}

export function TokenBalances({
  balances,
  isLoading,
  onRefresh,
  refreshing,
}: TokenBalancesProps) {
  return (
    <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Account Balances</CardTitle>
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
            <div className="text-sm">Fetching balances...</div>
          </div>
        ) : (
          balances.map((token) => (
            <div
              key={token.symbol}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{token.icon}</span>
                <div>
                  <div className="font-medium">{token.symbol}</div>
                  <div className="text-xs text-gray-500">{token.formatted}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">{token.formatted}</div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
