"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useReadContracts } from "wagmi"
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
  Loader2,
} from "lucide-react"
import { useDynamicContext } from "@dynamic-labs/sdk-react-core"
import erc20Abi from "@/abi/erc20.json"
import { formatUnits, parseUnits, encodeFunctionData } from "viem"
import type { Abi } from "viem"
import mockSwapAbi from "@/abi/mockswap.json"
import { isZeroDevConnector } from "@dynamic-labs/ethereum-aa"

const tokens: {
  address: `0x${string}`
  symbol: string
  icon: string
  formatted?: string
}[] = [
  {
    address: "0x6c6Dc940F2E6a27921df887AD96AE586abD8EfD8",
    symbol: "mUSDC",
    icon: "💵",
  },
  {
    address: "0x2eC77FDcb56370A3C0aDa518DDe86D820d76743B",
    symbol: "mPEPE",
    icon: "🐸",
  },
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

// Add your deployed MockSwap contract address here:
const MOCK_SWAP_ADDRESS =
  "0x718421BB9a6Bb63D4A63295d59c12196c3e221Ed" as `0x${string}`

export default function TokenSwapDApp() {
  const [fromToken, setFromToken] = useState(tokens[0])
  const [toToken, setToToken] = useState(tokens[1])
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const [isSwapping, setIsSwapping] = useState(false)
  const [slippage, setSlippage] = useState([0.5])
  const [expiry, setExpiry] = useState([5])
  const [swapStatus, setSwapStatus] = useState<
    null | "pending" | "success" | "error"
  >(null)
  const [error, setError] = useState("")
  const [txHash, setTxHash] = useState("")

  const { primaryWallet } = useDynamicContext()

  console.log("primaryWallet object:", primaryWallet)
  console.log(
    "isZeroDevConnector:",
    isZeroDevConnector(primaryWallet?.connector!)
  )

  useEffect(() => {
    if (primaryWallet) {
      setIsConnected(true)
    }
  }, [primaryWallet])
  const { data, isLoading } = useReadContracts({
    contracts: tokens.flatMap((token) => [
      {
        address: token.address,
        abi: erc20Abi as Abi,
        functionName: "balanceOf",
        args: [primaryWallet?.address!],
      },
      {
        address: token.address,
        abi: erc20Abi as Abi,
        functionName: "decimals",
      },
    ]),
    allowFailure: false,
    query: {
      enabled: !!primaryWallet?.address,
    },
  })

  const TokenBalances = tokens.map((token, i) => {
    const balanceRaw = data?.[i * 2] as bigint | undefined
    const decimals = data?.[i * 2 + 1] as number | undefined
    const formatted =
      balanceRaw !== undefined && decimals !== undefined
        ? formatUnits(balanceRaw, decimals)
        : "-"
    return {
      ...token,
      formatted,
    }
  })

  const handleSwapTokens = () => {
    const tempToken = fromToken
    setFromToken(toToken)
    setToToken(tempToken)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
  }

  console.log("all wallet details:", primaryWallet)
  const handleSwap = async () => {
    setError("")
    setTxHash("")
    if (
      !primaryWallet ||
      !isZeroDevConnector(primaryWallet.connector) ||
      !fromAmount
    ) {
      setError("Smart wallet not ready or amount missing")
      return
    }
    const connector = primaryWallet?.connector
    const kernelClient = connector.getAccountAbstractionProvider({
      withSponsorship: true,
    })
    if (!kernelClient) {
      setError("No kernel client found")
      return
    }
    setIsSwapping(true)
    setSwapStatus("pending")
    try {
      // Determine decimals for fromToken
      let decimals = 18 // default
      if (fromToken.symbol === "USDC" || fromToken.symbol === "mUSDC") {
        decimals = 6
      } else if (fromToken.symbol === "PEPE" || fromToken.symbol === "mPEPE") {
        decimals = 18
      }
      const amount = BigInt(parseUnits(fromAmount, decimals).toString())
      console.log("amount", amount)
      // Check allowance before swap

      // Only send swap call (no approve)
      const swapCall = {
        to: MOCK_SWAP_ADDRESS,
        value: BigInt(0),
        data: encodeFunctionData({
          abi: mockSwapAbi.abi as Abi,
          functionName: "swapAToB",
          args: [amount],
        }),
      }
      // Send swap and wait for receipt
      const swapUserOpHash = await kernelClient.sendUserOperation({
        callData: await kernelClient.account.encodeCalls([swapCall]),
      })
      const { receipt } = await kernelClient.waitForUserOperationReceipt({
        hash: swapUserOpHash,
      })
      setSwapStatus("success")
      setTxHash(receipt.transactionHash)
    } catch (e: any) {
      setSwapStatus("error")
      setError(e.message || "Swap failed")
      console.error(e)
    } finally {
      setIsSwapping(false)
    }
  }
  console.log("amount", fromAmount)
  const copyAddress = () => {
    navigator.clipboard.writeText(primaryWallet?.address!)
  }
  console.log("swap status:", swapStatus)
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
                    <span>Smart Account: {primaryWallet?.address}</span>
                    <code className="bg-gray-100 rounded text-xs">
                      {primaryWallet?.address}
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
                          Balance:{" "}
                          {TokenBalances.find(
                            (t) => t.symbol === fromToken.symbol
                          )?.formatted ?? "-"}
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
                          Balance:{" "}
                          {TokenBalances.find(
                            (t) => t.symbol === toToken.symbol
                          )?.formatted ?? "-"}
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
                  onClick={() => handleSwap()}
                  disabled={
                    !isConnected ||
                    !fromAmount ||
                    isSwapping ||
                    !(
                      primaryWallet?.connector &&
                      isZeroDevConnector(primaryWallet.connector)
                    )
                  }
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
                  {isLoading ? (
                    <div>Loading balances...</div>
                  ) : (
                    TokenBalances.map((token) => (
                      <div
                        key={token.symbol}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{token.icon}</span>
                          <div>
                            <div className="font-medium">{token.symbol}</div>
                            <div className="text-xs text-gray-500">
                              {token.formatted}
                            </div>
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
