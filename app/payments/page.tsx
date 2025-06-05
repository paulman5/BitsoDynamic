"use client"

import { FC, FormEventHandler, useState, useEffect } from "react"
import { parseEther } from "viem"
import { useDynamicContext } from "@dynamic-labs/sdk-react-core"
import { isEthereumWallet } from "@dynamic-labs/ethereum"
import { useTokenBalances } from "@dynamic-labs/sdk-react-core"
import { normalize } from "viem/ens"
import { publicClient } from "@/components/client"
import { walletClient } from "@/components/config"
import { sepolia } from "viem/chains"
import { Input } from "@/components/ui/input"
import { useUserWallets } from "@dynamic-labs/sdk-react-core"
import { useSmartAccount } from "@/hooks/useSmartaccount"

const SendTransactionSection: FC = () => {
  const { primaryWallet } = useDynamicContext()
  const [txnHash, setTxnHash] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [value, setValue] = useState<string>("")
  const [addressToSendTo, setAddressToSendTo] = useState<
    `0x${string}` | string
  >()
  const [status, setStatus] = useState<null | "pending" | "success" | "error">(
    null
  )
  const [error, setError] = useState<string | null>(null)
  const { accountAddress } = useSmartAccount()
  const {
    tokenBalances,
    isLoading,
    isError,
    error: tokenError,
  } = useTokenBalances()

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus("pending")
    setError(null)
    setTxnHash("")
    try {
      // Prepare ERC20 transfer call (USDC as example)
      const res = await fetch("/api/smartaccount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calls: [
            {
              to: "0x6c6Dc940F2E6a27921df887AD96AE586abD8EfD8", // USDC token address
              data: {
                // This will be encoded in the API route
                functionName: "transfer",
                args: [addressToSendTo, value],
              },
            },
          ],
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Unknown error")
      setTxnHash(data.userOpHash || data.txHash)
      setStatus("success")
    } catch (e: any) {
      setError(e.message)
      setStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!primaryWallet) {
    return <p>Please connect a wallet to send transactions.</p>
  }

  return (
    <>
      <form onSubmit={handleSend}>
        <p>Send to ETH address</p>
        <Input
          name="address"
          type="text"
          required
          placeholder="Address"
          onChange={(e) => setAddressToSendTo(e.target.value)}
        />
        <Input
          name="amount"
          type="text"
          required
          placeholder="0.05"
          onChange={(e) => setValue(e.target.value)}
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send"}
        </button>
        {status === "success" && txnHash && (
          <p>
            Transaction sent! Hash: <span>{txnHash}</span>
          </p>
        )}
        {status === "error" && error && (
          <p style={{ color: "red" }}>Error: {error}</p>
        )}
      </form>
      <ul>
        {tokenBalances?.map((tokenBalance) => (
          <li key={tokenBalance.address}>
            <p>Token balances:</p>
            {tokenBalance.name} {tokenBalance.balance} {tokenBalance.symbol} ($
            {tokenBalance.price}) | ${tokenBalance.marketValue}
          </li>
        ))}
      </ul>
    </>
  )
}

const PaymentsPage: FC = () => {
  return (
    <div>
      <h1>Payments</h1>
      <SendTransactionSection />
    </div>
  )
}

export default PaymentsPage
