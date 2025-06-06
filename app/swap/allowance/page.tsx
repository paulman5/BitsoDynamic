"use client"

import { useState } from "react"
import erc20Abi from "@/abi/erc20.json"
import { Abi, formatUnits, parseUnits } from "viem"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { createPublicClient, http } from "viem"
import { sepolia } from "viem/chains"
import { useDynamicContext } from "@dynamic-labs/sdk-react-core"
import { isZeroDevConnector } from "@dynamic-labs/ethereum-aa"

// Hardcoded values for test
const TEST_TOKEN_ADDRESS =
  "0x6c6Dc940F2E6a27921df887AD96AE586abD8EfD8" as `0x${string}`
const TEST_TOKEN_ADDRESS_2 =
  "0x2eC77FDcb56370A3C0aDa518DDe86D820d76743B" as `0x${string}`
const TEST_SPENDER_ADDRESS =
  "0x718421BB9a6Bb63D4A63295d59c12196c3e221Ed" as `0x${string}`
const TOKEN_DECIMALS = 6 // USDC for example

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(), // or use your ZERODEV_RPC if needed
})

export default function AllowanceTestPage() {
  const [owner, setOwner] = useState("")
  const [allowance, setAllowance] = useState<bigint | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [error, setError] = useState("")
  const [approveAmount, setApproveAmount] = useState("")
  const [isApproving, setIsApproving] = useState(false)
  const [approveStatus, setApproveStatus] = useState<
    null | "pending" | "success" | "error"
  >(null)
  const [approveTxHash, setApproveTxHash] = useState("")

  const { primaryWallet } = useDynamicContext()

  const handleCheckAllowance = async () => {
    setIsChecking(true)
    setError("")
    setAllowance(null)
    try {
      if (!owner) {
        setError("Please enter an owner address")
        setIsChecking(false)
        return
      }
      const allowanceResult = await publicClient.readContract({
        address: TEST_TOKEN_ADDRESS_2,
        abi: erc20Abi as Abi,
        functionName: "allowance",
        args: [owner, TEST_SPENDER_ADDRESS],
      })
      const allowanceBigInt = BigInt(allowanceResult as string)
      setAllowance(allowanceBigInt)
      console.log("[TestPage] Allowance (raw):", allowanceBigInt.toString())
    } catch (e: any) {
      setError(e.message || "Failed to check allowance")
      setAllowance(null)
    } finally {
      setIsChecking(false)
    }
  }

  const handleApprove = async () => {
    setError("")
    setApproveStatus("pending")
    setIsApproving(true)
    setApproveTxHash("")
    try {
      if (!primaryWallet || !isZeroDevConnector(primaryWallet.connector)) {
        setError("Smart wallet not connected or not a ZeroDev wallet.")
        setApproveStatus("error")
        setIsApproving(false)
        return
      }
      if (!approveAmount) {
        setError("Enter an amount to approve.")
        setApproveStatus("error")
        setIsApproving(false)
        return
      }
      const connector = primaryWallet.connector
      const kernelClient = connector.getAccountAbstractionProvider({
        withSponsorship: true,
      })
      if (!kernelClient) {
        setError("No kernel client found")
        setApproveStatus("error")
        setIsApproving(false)
        return
      }
      const amount = BigInt(
        parseUnits(approveAmount, TOKEN_DECIMALS).toString()
      )
      const approveCall = {
        to: TEST_TOKEN_ADDRESS,
        value: BigInt(0),
        data: (await import("viem")).encodeFunctionData({
          abi: erc20Abi as Abi,
          functionName: "approve",
          args: [TEST_SPENDER_ADDRESS, amount],
        }),
      }
      const userOpHash = await kernelClient.sendUserOperation({
        callData: await kernelClient.account.encodeCalls([approveCall]),
      })
      console.log("userOpHash", userOpHash)
      setApproveTxHash(userOpHash)
      setApproveStatus("success")
      const { receipt } = await kernelClient.waitForUserOperationReceipt({
        hash: userOpHash,
      })
      console.log("Transaction hash:", receipt.transactionHash)
    } catch (e: any) {
      setError(e.message || "Approve failed")
      setApproveStatus("error")
      console.error(e)
    } finally {
      setIsApproving(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow max-w-md w-full">
        <h1 className="text-xl font-bold mb-4">Allowance Test Page</h1>
        <div className="mb-4">
          <label className="block mb-1 text-sm">Owner Address</label>
          <Input
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            placeholder="0x..."
            className="w-full"
          />
        </div>
        <Button
          onClick={handleCheckAllowance}
          disabled={isChecking || !owner}
          className="w-full"
        >
          {isChecking ? "Checking..." : "Check Allowance"}
        </Button>
        {allowance !== null && (
          <div className="mt-4 text-green-700">
            Allowance: {allowance.toString()} (raw)
            <br />
            Human: {formatUnits(allowance, TOKEN_DECIMALS)}
          </div>
        )}
        <div className="mt-8">
          <label className="block mb-1 text-sm">Set Allowance Amount</label>
          <Input
            value={approveAmount}
            onChange={(e) => setApproveAmount(e.target.value)}
            placeholder={`Amount (${TOKEN_DECIMALS} decimals)`}
            className="w-full"
            type="number"
            min="0"
          />
          <Button
            onClick={handleApprove}
            disabled={isApproving || !approveAmount}
            className="w-full mt-2"
          >
            {isApproving ? "Approving..." : "Set Allowance"}
          </Button>
          {approveStatus === "success" && approveTxHash && (
            <div className="mt-2 text-green-700">
              Approve sent! UserOp Hash: {approveTxHash}
            </div>
          )}
          {approveStatus === "error" && error && (
            <div className="mt-2 text-red-600">Error: {error}</div>
          )}
        </div>
        {error && approveStatus !== "error" && (
          <div className="mt-4 text-red-600">Error: {error}</div>
        )}
      </div>
    </div>
  )
}
