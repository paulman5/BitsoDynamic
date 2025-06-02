"use client"

import { useEffect } from "react"
import { Wrapper } from "@/components/Wrapper"
import { useDynamicContext } from "@dynamic-labs/sdk-react-core"
// import { useTokenBalances } from "@dynamic-labs/sdk-react-core"
import { useRpcProviders } from "@dynamic-labs/sdk-react-core"
import { evmProvidersSelector } from "@dynamic-labs/ethereum-core"
import { useIsLoggedIn } from "@dynamic-labs/sdk-react-core"
import { useRouter } from "next/navigation"

const Page = () => {
  // const { tokenBalances, isLoading, isError, error } = useTokenBalances()

  return (
    <main>
      <Wrapper>
        <></>
      </Wrapper>
    </main>
  )
}

export default Page
