// app/api/init-smart-account/route.ts (Next.js App Router)

import { NextResponse } from "next/server"
import {
  createKernelAccount,
  createKernelAccountClient,
  createZeroDevPaymasterClient,
} from "@zerodev/sdk"
import { KERNEL_V3_1, getEntryPoint } from "@zerodev/sdk/constants"
import { signerToEcdsaValidator } from "@zerodev/ecdsa-validator"
import { http, createPublicClient } from "viem"
import { baseSepolia } from "viem/chains"
import { privateKeyToAccount } from "viem/accounts"

export async function GET() {
  const privateKey = process.env.PRIVATE_KEY as `0x${string}`
  const ZERODEV_RPC = process.env.ZERODEV_RPC!

  console.log("privateKey", privateKey)

  if (!privateKey || !ZERODEV_RPC) {
    return NextResponse.json({ error: "Missing env vars" }, { status: 500 })
  }

  const entryPoint = getEntryPoint("0.7")
  const kernelVersion = KERNEL_V3_1
  const chain = baseSepolia

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
      getPaymasterData(userOp) {
        return paymaster.sponsorUserOperation({ userOperation: userOp })
      },
    },
  })

  return NextResponse.json({
    address: account.address,
  })
}
