"use client"

import { useEffect, useState } from "react"
import {
  createKernelAccount,
  createKernelAccountClient,
  createZeroDevPaymasterClient,
} from "@zerodev/sdk"
import { KERNEL_V3_1, getEntryPoint } from "@zerodev/sdk/constants"
import { signerToEcdsaValidator } from "@zerodev/ecdsa-validator"
import { http, createPublicClient, zeroAddress } from "viem"
import { baseSepolia } from "viem/chains"
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts"
import type { KernelAccountClient } from "@zerodev/sdk"

const ZERODEV_RPC = process.env.ZERODEV_RPC

export const useSmartAccount = () => {
  const [kernelClient, setKernelClient] = useState<KernelAccountClient | any>(
    null
  )
  const [accountAddress, setAccountAddress] = useState<string | null>(null)

  console.log("the RPC URL is", ZERODEV_RPC)

  useEffect(() => {
    const setup = async () => {
      const entryPoint = getEntryPoint("0.7")
      const kernelVersion = KERNEL_V3_1
      const chain = baseSepolia

      const privateKey = generatePrivateKey()
      const signer = privateKeyToAccount(privateKey)

      const publicClient = createPublicClient({
        transport: http(ZERODEV_RPC),
        chain,
      })

      const validator = await signerToEcdsaValidator(publicClient, {
        signer,
        entryPoint,
        kernelVersion,
      })

      const account = await createKernelAccount(publicClient, {
        plugins: { sudo: validator },
        entryPoint,
        kernelVersion,
      })

      const paymaster = createZeroDevPaymasterClient({
        chain,
        transport: http(ZERODEV_RPC),
      })

      const client = createKernelAccountClient({
        account,
        chain,
        bundlerTransport: http(ZERODEV_RPC),
        client: publicClient,
        paymaster: {
          getPaymasterData(userOperation) {
            return paymaster.sponsorUserOperation({ userOperation })
          },
        },
      })

      setKernelClient(client)
      setAccountAddress(client.account.address)
    }

    setup()
  }, [])

  return { kernelClient, accountAddress }
}
