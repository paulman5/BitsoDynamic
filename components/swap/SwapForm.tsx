import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowUpDown, Loader2 } from "lucide-react"

export type TokenType = {
  address: `0x${string}`
  symbol: string
  icon: string
  formatted?: string
}

export type SwapFormProps = {
  fromToken: TokenType
  toToken: TokenType
  setFromToken: (token: TokenType) => void
  setToToken: (token: TokenType) => void
  fromAmount: string
  setFromAmount: (amount: string) => void
  toAmount: string
  isSwapping: boolean
  handleSwap: () => void
  handleSwapTokens: () => void
  primaryWallet: any
  isSupportedConnector: boolean
  tokenBalances: TokenType[]
}

export function SwapForm({
  fromToken,
  toToken,
  setFromToken,
  setToToken,
  fromAmount,
  setFromAmount,
  toAmount,
  isSwapping,
  handleSwap,
  handleSwapTokens,
  primaryWallet,
  isSupportedConnector,
  tokenBalances,
}: SwapFormProps) {
  return (
    <>
      {/* From Token */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">From</label>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-center justify-between mb-3">
            <Select
              value={fromToken.symbol}
              onValueChange={(value) => {
                const token = tokenBalances.find((t) => t.symbol === value)
                if (token) setFromToken(token)
              }}
            >
              <SelectTrigger className="w-auto border-0 bg-white/80 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{fromToken.icon}</span>
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                {tokenBalances.map((token) => (
                  <SelectItem key={token.symbol} value={token.symbol}>
                    <div className="flex items-center gap-2">
                      <span>{token.icon}</span>
                      <span>{token.symbol}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-right">
              <Input
                type="number"
                placeholder="0.0"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                className="text-right text-xl font-semibold border-0 bg-transparent p-0 h-auto"
              />
              <div className="text-xs text-gray-500 mt-1">
                Balance:{" "}
                {tokenBalances.find((t) => t.symbol === fromToken.symbol)
                  ?.formatted ?? "-"}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Swap Direction */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSwapTokens}
          className="rounded-full w-10 h-10 p-0 border-2 bg-white hover:bg-gray-50"
        >
          <ArrowUpDown className="w-4 h-4" />
        </Button>
      </div>
      {/* To Token */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">To</label>
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
          <div className="flex items-center justify-between mb-3">
            <Select
              value={toToken.symbol}
              onValueChange={(value) => {
                const token = tokenBalances.find((t) => t.symbol === value)
                if (token) setToToken(token)
              }}
            >
              <SelectTrigger className="w-auto border-0 bg-white/80 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{toToken.icon}</span>
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                {tokenBalances.map((token) => (
                  <SelectItem key={token.symbol} value={token.symbol}>
                    <div className="flex items-center gap-2">
                      <span>{token.icon}</span>
                      <span>{token.symbol}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-right">
              <Input
                type="number"
                placeholder="0.0"
                value={toAmount}
                readOnly
                className="text-right text-xl font-semibold border-0 bg-transparent p-0 h-auto"
              />
              <div className="text-xs text-gray-500 mt-1">
                Balance:{" "}
                {tokenBalances.find((t) => t.symbol === toToken.symbol)
                  ?.formatted ?? "-"}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Swap Button */}
      <Button
        onClick={handleSwap}
        disabled={
          !primaryWallet ||
          !fromAmount ||
          isSwapping ||
          !(primaryWallet?.connector && isSupportedConnector)
        }
        className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50"
      >
        {isSwapping ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Swapping...
          </>
        ) : !primaryWallet ? (
          "Connect Wallet to Swap"
        ) : (
          "Swap Tokens"
        )}
      </Button>
    </>
  )
}
