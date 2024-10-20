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

const SendTransactionSection: FC = () => {
  const { primaryWallet } = useDynamicContext()
  const [txnHash, setTxnHash] = useState("")
  const [currentAddress, setCurrentAddress] = useState<string | undefined>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [ensName, SetEnsName] = useState<string>("")
  const [ensNameTo, setEnsNameTo] = useState<string>("")
  const [value, setValue] = useState<string>("")
  const [addressToSendTo, setAddressToSendTo] = useState<
    `0x${string}` | string
  >()
  const [transactionData, setTransactionData] = useState(null)

  const userWallets = useUserWallets()
  const currentUser = userWallets[0]

  

  useEffect(() => {
    async function fetchTransactionData() {
      try {
        const response = await fetch("/api/transaction")
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`)
        }

        const data = await response.json()
        setTransactionData(data)
        console.log("transaction data", data)
      } catch (err) {
        console.log("error fetching transaction data", err)
      }
    }

    fetchTransactionData()
  }, []) // Adding an empty dependency array to fetch data only on component mount

  console.log("the transaction data:", transactionData)

  console.log("the data of the webhook is:", transactionData)

  console.log("currentUser", currentUser)
  console.log("currentAddress", currentAddress)

  const initiateResolverAddress = async () => {
    const resolverAddress = await publicClient.getEnsResolver({
      name: normalize(ensName),
    })
  }

  const initiateAddressToSendTo = async () => {
    const addressToSentTo = await publicClient.getEnsResolver({
      name: normalize(ensNameTo),
    })
  }

  useEffect(() => {}, [ensName])
  const { tokenBalances, isLoading, isError, error } = useTokenBalances()

  const initiateTransaction = async () => {
    if (!walletClient) {
      console.error("Wallet client is not initialized")
      return
    }

    const hash = await walletClient.sendTransaction({
      account: currentAddress as `0x${string}`,
      to: addressToSendTo as `0x${string}`,
      value: parseEther(value),
      chain: sepolia,
    })
  }

  if (!primaryWallet || !isEthereumWallet(primaryWallet)) {
    return <p>Please connect an Ethereum wallet to send transactions.</p>
  }

  return (
    <>
      <form>
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
        <button
          onClick={() => initiateTransaction()}
          type="submit"
          disabled={isSubmitting}
        >
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
