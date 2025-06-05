"use client"

import { useEffect, useState } from "react"
import { useDynamicContext } from "@dynamic-labs/sdk-react-core"
import { isZeroDevConnector } from "@dynamic-labs/ethereum-aa"

export const useSmartAccount = () => {
  const { primaryWallet } = useDynamicContext()
  const [accountAddress, setAccountAddress] = useState<string | null>(null)
  const [kernelClient, setKernelClient] = useState<any>(null)

  useEffect(() => {
    const getKernel = async () => {
      if (!primaryWallet || !isZeroDevConnector(primaryWallet.connector)) {
        setAccountAddress(null)
        setKernelClient(null)
        return
      }
      await primaryWallet.connector.getNetwork()
      setAccountAddress(primaryWallet.address)
      const client = primaryWallet.connector.getAccountAbstractionProvider({
        withSponsorship: true,
      })
      setKernelClient(client)
    }
    getKernel()
  }, [primaryWallet])

  return { accountAddress, kernelClient }
}
