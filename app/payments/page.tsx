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

  const { user } = useDynamicContext()

  const userWallets = useUserWallets()
  const currentUser = userWallets[0]

  useEffect(() => {
    setCurrentAddress(user?.verifiedCredentials[0].address)
  }, [user?.verifiedCredentials])

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
        to: currentAddress?.toLowerCase().startsWith("0x")
          ? currentAddress
          : `0x${currentAddress}`,
        value: value ? parseEther(value) : undefined,
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
