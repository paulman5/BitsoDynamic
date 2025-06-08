"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useReadContracts } from "wagmi"

import { Badge } from "@/components/ui/badge"

import { useDynamicContext } from "@dynamic-labs/sdk-react-core"
import erc20Abi from "@/abi/erc20.json"
import { formatUnits, parseUnits, encodeFunctionData } from "viem"
import type { Abi } from "viem"
import mockSwapAbi from "@/abi/mockswap.json"
import { isZeroDevConnector } from "@dynamic-labs/ethereum-aa"

import { AccountInfo } from "@/components/swap/AccountInfo"
import { TokenBalances } from "@/components/swap/TokenBalances"
import { SwapForm } from "@/components/swap/SwapForm"
import { SwapLogs } from "@/components/swap/SwapLogs"
import { SwapHistory } from "@/components/swap/SwapHistory"

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

  const tokenBalances = tokens.map((token, i) => {
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
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <div className="w-full max-w-5xl mx-auto px-4 py-10 z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Swap Card */}
          <Card className="rounded-3xl shadow-2xl bg-white/80 backdrop-blur-xl border-0 p-0 animate-fade-in">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-3xl font-extrabold text-gray-900 tracking-tight">
                  Swap
                </CardTitle>
                <Badge
                  variant="secondary"
                  className="bg-blue-50 text-blue-700 border-blue-200 text-xs px-2 py-1 rounded-lg"
                >
                  Gas Sponsored
                </Badge>
              </div>
              {primaryWallet && (
                <AccountInfo
                  address={primaryWallet.address}
                  onCopy={copyAddress}
                  copySuccess={copySuccess}
                />
              )}
            </CardHeader>
            <CardContent className="space-y-8">
              <SwapForm
                fromToken={fromToken}
                toToken={toToken}
                setFromToken={setFromToken}
                setToToken={setToToken}
                fromAmount={fromAmount}
                setFromAmount={setFromAmount}
                toAmount={toAmount}
                isSwapping={isSwapping}
                handleSwap={handleSwap}
                handleSwapTokens={handleSwapTokens}
                primaryWallet={primaryWallet}
                isSupportedConnector={isSupportedConnector}
                tokenBalances={tokenBalances}
              />
              <SwapLogs logs={txLogs} isSwapping={isSwapping} />
            </CardContent>
          </Card>
          {/* Sidebar: Balances + History */}
          <div className="flex flex-col gap-8 w-full">
            {primaryWallet && (
              <TokenBalances
                balances={tokenBalances}
                isLoading={isLoading || balancesLoading}
                onRefresh={handleRefresh}
                refreshing={refreshing}
              />
            )}
            <SwapHistory
              history={swapHistory}
              isLoading={txLoading}
              onRefresh={() => {
                setTxLoading(true)
                setTransactions([])
                setTimeout(() => {
                  setTransactions([])
                  setTxLoading(false)
                }, 1200)
              }}
              refreshing={txLoading}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
