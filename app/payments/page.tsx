"use client"

import { FC, FormEventHandler, useState, useEffect } from "react"
import { parseEther } from "viem"
import { useDynamicContext } from "@dynamic-labs/sdk-react-core"
import { isEthereumWallet } from "@dynamic-labs/ethereum"
import { useTokenBalances } from "@dynamic-labs/sdk-react-core"
import { normalize } from "viem/ens"
import { publicClient } from "@/components/client"
import { account, walletClient } from "@/components/config"

const SendTransactionSection: FC = async () => {
  const { primaryWallet } = useDynamicContext()
  const [txnHash, setTxnHash] = useState("")
  const [address, setAddress] = useState("")
  const [amount, setAmount] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [ensName, SetEnsName] = useState<string>("")
  const [ensNameTo, setEnsNameTo] = useState<string>("")

  const { user } = useDynamicContext()

  console.log("user info", user)
  const resolverAddress = await publicClient.getEnsResolver({
    name: normalize(ensName),
  })

  const addressToSentTo = await publicClient.getEnsResolver({
    name: normalize(ensNameTo),
  })

  useEffect(() => {}, [ensName])
  const { tokenBalances, isLoading, isError, error } = useTokenBalances()

  const hash = await walletClient.sendTransaction({
    account: ensName as `0x${string}`,
    to: ensNameTo as `0x${string}`,
    value: parseEther("1"),
  })

  const onSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    if (!primaryWallet || !isEthereumWallet(primaryWallet)) {
      console.error("No Ethereum wallet connected")
      return
    }
    setIsSubmitting(true)

    try {
      const publicClient = await primaryWallet.getPublicClient()
      const walletClient = await primaryWallet.getWalletClient()

      const transaction = {
        to: address.toLowerCase().startsWith("0x") ? address : `0x${address}`,
        value: amount ? parseEther(amount) : undefined,
      }

      const hash = await walletClient.sendTransaction(transaction)
      setTxnHash(hash)

      const receipt = await publicClient.getTransactionReceipt({ hash })
      console.log(receipt)
    } catch (error) {
      console.error("Transaction failed:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!primaryWallet || !isEthereumWallet(primaryWallet)) {
    return <p>Please connect an Ethereum wallet to send transactions.</p>
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <p>Send to ETH address</p>
        <input
          name="address"
          type="text"
          required
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <input
          name="amount"
          type="text"
          required
          placeholder="0.05"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send"}
        </button>
        {txnHash && (
          <p>
            Transaction sent! Hash:{" "}
            <span data-testid="transaction-section-result-hash">{txnHash}</span>
          </p>
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
