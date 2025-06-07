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
  Check,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const tokens: {
  address: `0x${string}`
  symbol: string
  icon: string
  formatted?: string
}[] = [
  {
    address: process.env.NEXT_PUBLIC_MOCK_USDC as `0x${string}`,
    symbol: "mUSDC",
    icon: "💵",
  },
  {
    address: process.env.NEXT_PUBLIC_MOCK_PEPE as `0x${string}`,
    symbol: "mPEPE",
    icon: "🐸",
  },
]

export default function TokenSwapDApp() {
  const { primaryWallet } = useDynamicContext()
  const connector = primaryWallet?.connector
  const isSupportedConnector = connector ? isZeroDevConnector(connector) : false
  const mockSwap = process.env.NEXT_PUBLIC_MOCK_SWAP as `0x${string}`

  const [fromToken, setFromToken] = useState(tokens[0])
  const [toToken, setToToken] = useState(tokens[1])
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [isSwapping, setIsSwapping] = useState(false)
  const [swapStatus, setSwapStatus] = useState<
    null | "pending" | "success" | "error"
  >(null)
  const [error, setError] = useState("")
  const [txHash, setTxHash] = useState("")
  const [copySuccess, setCopySuccess] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [balancesLoading, setBalancesLoading] = useState(false)
  const [transactions, setTransactions] = useState<any[]>([])
  const [txLoading, setTxLoading] = useState(false)
  const [swapHistory, setSwapHistory] = useState<any[]>([])
  const [txLogs, setTxLogs] = useState<string[]>([])

  console.log("primaryWallet object:", primaryWallet)
  console.log("connector:", connector)
  console.log("isSupportedConnector:", isSupportedConnector)

  const { data, isLoading, refetch } = useReadContracts({
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
    setFromAmount("")
  }

  const handleSwap = async () => {
    setError("")
    setTxHash("")
    setTxLogs(["Swap initiated..."])

    if (!connector) {
      setError("No connector found")
      return
    }

    if (!isZeroDevConnector(connector)) {
      setError("Connector is not a ZeroDev connector")
      return
    }

    const kernelClient = connector?.getAccountAbstractionProvider({
      withSponsorship: true,
    })

    if (!kernelClient) {
      setError("No kernel client found")
      setTxLogs((logs: string[]) => [
        ...logs,
        "Swap failed: No kernel client found",
      ])
      return
    }

    setIsSwapping(true)
    setSwapStatus("pending")

    try {
      // Determine decimals for fromToken
      let decimals = fromToken.symbol.includes("mUSDC") ? 6 : 18
      const amount = BigInt(parseUnits(fromAmount, decimals).toString())
      setTxLogs((logs: string[]) => [
        ...logs,
        `Preparing swap for ${fromAmount} ${fromToken.symbol}`,
      ])

      // Choose function name based on direction
      let functionName = "swapAToB"
      if (fromToken.symbol === "mPEPE" && toToken.symbol === "mUSDC") {
        functionName = "swapBToA"
      }
      const swapCall = {
        to: mockSwap,
        value: BigInt(0),
        data: encodeFunctionData({
          abi: mockSwapAbi.abi as Abi,
          functionName,
          args: [amount],
        }),
      }
      setTxLogs((logs: string[]) => [...logs, "Sending UserOp..."])
      const swapUserOpHash = await kernelClient.sendUserOperation({
        callData: await kernelClient.account.encodeCalls([swapCall]),
      })
      setTxLogs((logs: string[]) => [
        ...logs,
        `UserOp sent: ${swapUserOpHash}`,
        "Waiting for receipt...",
      ])
      const { receipt } = await kernelClient.waitForUserOperationReceipt({
        hash: swapUserOpHash,
      })

      setSwapStatus("success")
      setTxHash(receipt.transactionHash)
      setTxLogs((logs: string[]) => [
        ...logs,
        `Swap completed! Tx Hash: ${receipt.transactionHash}`,
      ])
      setSwapHistory((prev) => [
        {
          id: receipt.transactionHash,
          type: "Swap",
          from: fromToken.symbol,
          to: toToken.symbol,
          amount: fromAmount,
          status: "success",
          timestamp: new Date().toLocaleTimeString(),
          gasSponsored: true,
        },
        ...prev,
      ])
    } catch (e: any) {
      setSwapStatus("error")
      setError(e.message || "Swap failed")
      setTxLogs((logs: string[]) => [
        ...logs,
        `Swap failed: ${e.message || "Unknown error"}`,
      ])
      console.error(e)
    } finally {
      setIsSwapping(false)
    }
  }

  const copyAddress = () => {
    if (primaryWallet?.address) {
      navigator.clipboard.writeText(primaryWallet.address)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 1500)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    setBalancesLoading(true)
    setTimeout(() => {
      refetch()
      setRefreshing(false)
      setBalancesLoading(false)
    }, 1000)
  }

  // Refresh balances on successful swap
  useEffect(() => {
    if (swapStatus === "success") {
      refetch()
    }
  }, [swapStatus, refetch])

  // Calculate toAmount based on conversion rate
  useEffect(() => {
    const from = parseFloat(fromAmount)
    if (isNaN(from)) {
      setToAmount("")
      return
    }
    // mUSDC to mPEPE: 1 mUSDC = 2 PEPE
    // mPEPE to mUSDC: 1 PEPE = 0.5 mUSDC
    if (fromToken.symbol === "mUSDC" && toToken.symbol === "mPEPE") {
      setToAmount((from * 2).toString())
    } else if (fromToken.symbol === "mPEPE" && toToken.symbol === "mUSDC") {
      setToAmount((from * 0.5).toString())
    }
  }, [fromAmount, fromToken, toToken])

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
                {primaryWallet && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Smart Account:</span>
                    <code className="bg-gray-100 rounded text-xs">
                      {primaryWallet.address}
                    </code>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyAddress()}
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
                          readOnly
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

                {/* Swap Button */}
                <Button
                  onClick={() => handleSwap()}
                  disabled={
                    !primaryWallet ||
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
                  ) : !primaryWallet ? (
                    "Connect Wallet to Swap"
                  ) : (
                    "Swap Tokens"
                  )}
                </Button>

                {/* Swap Logs */}
                {isSwapping && txLogs.length > 0 && (
                  <div className="text-xs text-blue-700 bg-blue-50 rounded p-3 mb-4">
                    <div className="font-semibold mb-2">Swap Progress</div>
                    <ul className="list-disc pl-5 space-y-1">
                      {txLogs.map((log, idx) => (
                        <li key={idx}>{log}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Transaction History & Account Info */}
          <div className="space-y-6">
            {/* Account Balance */}
            {primaryWallet && (
              <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Account Balances</CardTitle>
                    <Button variant="ghost" size="sm" onClick={handleRefresh}>
                      <RefreshCw
                        className={`w-4 h-4 transition-transform duration-700 ${refreshing ? "animate-spin" : ""}`}
                      />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {isLoading || balancesLoading ? (
                    <div className="text-center py-8 text-gray-500">
                      <Loader2 className="w-5 h-5 mx-auto animate-spin mb-2" />
                      <div className="text-sm">Fetching balances...</div>
                    </div>
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setTxLoading(true)
                      setTransactions([])
                      setTimeout(() => {
                        setTransactions([])
                        setTxLoading(false)
                      }, 1200)
                    }}
                  >
                    <RefreshCw
                      className={`w-4 h-4 transition-transform duration-700 ${txLoading ? "animate-spin" : ""}`}
                    />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {txLoading ? (
                  <div className="text-center py-8 text-gray-500">
                    <Loader2 className="w-5 h-5 mx-auto animate-spin mb-2" />
                    <div className="text-sm">Fetching transactions...</div>
                  </div>
                ) : swapHistory.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-sm">No transactions yet</div>
                  </div>
                ) : (
                  <>
                    {swapHistory.map((tx) => (
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
                            <span className="font-medium text-sm">
                              {tx.type}
                            </span>
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
          </div>
        </div>
      </div>
    </div>
  )
}
