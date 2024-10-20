"use client"

import { useEffect } from "react"
import { Wrapper } from "@/components/Wrapper"
import { useDynamicContext } from "@dynamic-labs/sdk-react-core"
import { Greeting } from "@/components/Greeting"
// import { useTokenBalances } from "@dynamic-labs/sdk-react-core"
import { useRpcProviders } from "@dynamic-labs/sdk-react-core"
import { evmProvidersSelector } from "@dynamic-labs/ethereum-core"
import { useIsLoggedIn } from "@dynamic-labs/sdk-react-core"
import { useRouter } from "next/navigation"

const Page = () => {
  const { defaultProvider } = useRpcProviders(evmProvidersSelector)

  const isLoggedIn = useIsLoggedIn()
  const router = useRouter()
  // const { setShowAuthFlow } = useDynamicContext()

  // const { tokenBalances, isLoading, isError, error } = useTokenBalances()

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/payments")
    }
  }, [isLoggedIn])

  return (
    <main>
      <Wrapper>
        <Greeting />
      </Wrapper>
    </main>
  )
}

export default Page
