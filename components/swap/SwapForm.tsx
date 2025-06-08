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
        <div className="bg-white/80 rounded-2xl p-5 border border-blue-100 flex items-center justify-between shadow-sm transition-all duration-200">
          {/* Amount input on the left */}
          <div className="flex-1 text-left">
            <Input
              type="number"
              placeholder="0.0"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="text-left text-2xl font-semibold border-0 bg-transparent p-0 h-auto focus:ring-0 focus:outline-none focus:border-0 shadow-none"
              style={{ minWidth: 80 }}
            />
            <div className="text-xs text-gray-500 mt-1">
              Balance:{" "}
              {tokenBalances.find((t) => t.symbol === fromToken.symbol)
                ?.formatted ?? "-"}
            </div>
          </div>
          {/* Token selector on the right */}
          <Select
            value={fromToken.symbol}
            onValueChange={(value) => {
              const token = tokenBalances.find((t) => t.symbol === value)
              if (token) setFromToken(token)
            }}
          >
            <SelectTrigger className="w-auto border-0 bg-transparent shadow-none focus:ring-0 focus:outline-none focus:border-0 rounded-xl px-3 py-2 transition-all ml-4">
              <div className="flex items-center gap-2">
                <span>{fromToken.symbol}</span>
                <span className="text-2xl">{fromToken.icon}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              {tokenBalances.map((token) => (
                <SelectItem
                  key={token.symbol}
                  value={token.symbol}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-50"
                >
                  <span>{token.symbol}</span>
                  <span className="text-xl">{token.icon}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* Swap Direction */}
      <div className="flex justify-center my-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleSwapTokens}
          className="rounded-full w-12 h-12 p-0 border-2 border-blue-200 bg-white hover:bg-blue-50 shadow transition-transform hover:scale-110"
        >
          <ArrowUpDown className="w-5 h-5" />
        </Button>
      </div>
      {/* To Token */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">To</label>
        <div className="bg-white/80 rounded-2xl p-5 border border-purple-100 flex items-center justify-between shadow-sm transition-all duration-200">
          {/* Amount input on the left */}
          <div className="flex-1 text-left">
            <Input
              type="number"
              placeholder="0.0"
              value={toAmount}
              readOnly
              className="text-left text-2xl font-semibold border-0 bg-transparent p-0 h-auto focus:ring-0 focus:outline-none focus:border-0 shadow-none"
              style={{ minWidth: 80 }}
            />
            <div className="text-xs text-gray-500 mt-1">
              Balance:{" "}
              {tokenBalances.find((t) => t.symbol === toToken.symbol)
                ?.formatted ?? "-"}
            </div>
          </div>
          {/* Token selector on the right */}
          <Select
            value={toToken.symbol}
            onValueChange={(value) => {
              const token = tokenBalances.find((t) => t.symbol === value)
              if (token) setToToken(token)
            }}
          >
            <SelectTrigger className="w-auto border-0 bg-transparent shadow-none focus:ring-0 focus:outline-none focus:border-0 rounded-xl px-3 py-2 transition-all ml-4">
              <div className="flex items-center gap-2">
                <span>{toToken.symbol}</span>
                <span className="text-2xl">{toToken.icon}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              {tokenBalances.map((token) => (
                <SelectItem
                  key={token.symbol}
                  value={token.symbol}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-purple-50"
                >
                  <span>{token.symbol}</span>
                  <span className="text-xl">{token.icon}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
        className="w-full h-16 text-xl font-bold rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl transition-all duration-200 mt-4 disabled:opacity-50"
      >
        {isSwapping ? (
          <>
            <Loader2 className="w-6 h-6 mr-2 animate-spin" />
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
