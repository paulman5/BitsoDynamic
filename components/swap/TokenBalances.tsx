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
    <Card className="rounded-2xl shadow-lg bg-white/80 backdrop-blur-xl border-0">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Account Balances
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
            <div className="text-sm">Fetching balances...</div>
          </div>
        ) : (
          balances.map((token) => (
            <div
              key={token.symbol}
              className="flex items-center justify-between p-3 bg-white/70 rounded-xl hover:bg-blue-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{token.icon}</span>
                <div>
                  <div className="font-medium text-gray-900">
                    {token.symbol}
                  </div>
                  <div className="text-xs text-gray-500">{token.formatted}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-lg text-gray-900">
                  {token.formatted}
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
