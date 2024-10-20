"use client"

import { useState, useEffect } from "react"
import { Wrapper } from "@/components/Wrapper"
import { useDynamicContext } from "@dynamic-labs/sdk-react-core"
import { Greeting } from "@/components/Greeting"
import { useTokenBalances } from "@dynamic-labs/sdk-react-core"
import { useRpcProviders } from "@dynamic-labs/sdk-react-core"
import { evmProvidersSelector } from "@dynamic-labs/ethereum-core"
import { useUserWallets } from "@dynamic-labs/sdk-react-core"

const Page = () => {
  const { defaultProvider } = useRpcProviders(evmProvidersSelector)
  const userWallets = useUserWallets()

  const { setShowAuthFlow } = useDynamicContext()

  const { tokenBalances, isLoading, isError, error } = useTokenBalances()

  useEffect(() => {
    userWallets.forEach(async (wallet) => {
      if (!wallet) return

      // Get the EVM Mainnet provider
      const provider = defaultProvider?.provider

      if (!provider) return

      // Fetch the wallet balance
      const balance = await provider.getBalance({
        address: wallet.address as "0x${string}",
      })

      console.log("balance", balance.toString())
      console.log("wallet", wallet.address)
    })
  }, [userWallets, defaultProvider])

  return (
    <main>
      <Wrapper>
        <Greeting />
      </Wrapper>
    </main>
  )
}

export default Page
