"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import {
  ArrowUpDown,
  Copy,
  ExternalLink,
  RefreshCw,
  Clock,
  CheckCircle,
  Loader2,
} from "lucide-react"
import { useDynamicContext } from "@dynamic-labs/sdk-react-core"
import { useSmartAccount } from "@/hooks/useSmartaccount"

const tokens = [
  { symbol: "PEPE", name: "Pepe", balance: "1,250,000", icon: "🐸" },
  { symbol: "USDC", name: "USD Coin", balance: "500.00", icon: "💵" },
  { symbol: "WETH", name: "Wrapped Ethereum", balance: "2.5", icon: "⚡" },
  { symbol: "UNI", name: "Uniswap", balance: "150.0", icon: "🦄" },
]

const transactions = [
  {
    id: "0x1a2b3c...",
    type: "Swap",
    from: "PEPE",
    to: "USDC",
    amount: "100,000",
    status: "success",
    timestamp: "2 min ago",
    gasSponsored: true,
  },
  {
    id: "0x4d5e6f...",
    type: "Approve",
    from: "WETH",
    to: "",
    amount: "1.0",
    status: "pending",
    timestamp: "5 min ago",
    gasSponsored: true,
  },
]

export default function TokenSwapDApp() {
  const [fromToken, setFromToken] = useState(tokens[0])
  const [toToken, setToToken] = useState(tokens[1])
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const [smartAccount, setSmartAccount] = useState("")
  const [isSwapping, setIsSwapping] = useState(false)
  const [slippage, setSlippage] = useState([0.5])
  const [expiry, setExpiry] = useState([5])

  const { primaryWallet } = useDynamicContext()
  const { accountAddress } = useSmartAccount()

  const handleSwapTokens = () => {
    const tempToken = fromToken
    setFromToken(toToken)
    setToToken(tempToken)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
  }

  const handleSwap = async () => {
    setIsSwapping(true)
    // Simulate swap process
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setIsSwapping(false)
  }

  useEffect(() => {
    if (primaryWallet) {
      setIsConnected(true)
    }
  }, [primaryWallet])

  const copyAddress = () => {
    navigator.clipboard.writeText(smartAccount)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Main Swap Interface */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    Token Swap
                  </CardTitle>
                  <Badge
                    variant="secondary"
                    className="bg-blue-50 text-blue-700 border-blue-200"
                  >
                    Gas Sponsored
                  </Badge>
                </div>
                {isConnected && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Smart Account: {accountAddress}</span>
                    <code className="bg-gray-100 rounded text-xs">
                      {smartAccount}
                    </code>
                    <Button variant="ghost" size="sm" onClick={copyAddress}>
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </CardHeader>

              <CardContent className="space-y-6">
                {/* From Token */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    From
                  </label>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-center justify-between mb-3">
                      <Select
                        value={fromToken.symbol}
                        onValueChange={(value) => {
                          const token = tokens.find((t) => t.symbol === value)
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
                          {tokens.map((token) => (
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
                          Balance: {fromToken.balance}
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
                  <label className="text-sm font-medium text-gray-700">
                    To
                  </label>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                    <div className="flex items-center justify-between mb-3">
                      <Select
                        value={toToken.symbol}
                        onValueChange={(value) => {
                          const token = tokens.find((t) => t.symbol === value)
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
                          {tokens.map((token) => (
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
                          onChange={(e) => setToAmount(e.target.value)}
                          className="text-right text-xl font-semibold border-0 bg-transparent p-0 h-auto"
                        />
                        <div className="text-xs text-gray-500 mt-1">
                          Balance: {toToken.balance}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Swap Settings */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Slippage Tolerance
                    </label>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">
                          Max Slippage
                        </span>
                        <span className="text-sm font-medium">
                          {slippage[0]}%
                        </span>
                      </div>
                      <Slider
                        value={slippage}
                        onValueChange={setSlippage}
                        max={5}
                        min={0.1}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Transaction Expiry
                    </label>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium">
                          {expiry[0]} min
                        </span>
                      </div>
                      <Slider
                        value={expiry}
                        onValueChange={setExpiry}
                        max={30}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Swap Button */}
                <Button
                  onClick={handleSwap}
                  disabled={!isConnected || !fromAmount || isSwapping}
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50"
                >
                  {isSwapping ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Swapping...
                    </>
                  ) : !isConnected ? (
                    "Connect Wallet to Swap"
                  ) : (
                    "Swap Tokens"
                  )}
                </Button>

                {isConnected && (
                  <div className="text-center text-sm text-gray-600">
                    <span className="inline-flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Gas fees sponsored by Paymaster
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Transaction History & Account Info */}
          <div className="space-y-6">
            {/* Account Balance */}
            {isConnected && (
              <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Account Balances</CardTitle>
                    <Button variant="ghost" size="sm">
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {tokens.map((token) => (
                    <div
                      key={token.symbol}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{token.icon}</span>
                        <div>
                          <div className="font-medium">{token.symbol}</div>
                          <div className="text-xs text-gray-500">
                            {token.name}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{token.balance}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Transaction History */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Transaction History</CardTitle>
                  <Button variant="ghost" size="sm">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {transactions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-sm">No transactions yet</div>
                  </div>
                ) : (
                  transactions.map((tx) => (
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
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
