// app/api/init-smart-account/route.ts (Next.js App Router)

import { NextResponse } from "next/server"
import {
  createKernelAccount,
  createKernelAccountClient,
  createZeroDevPaymasterClient,
} from "@zerodev/sdk"
import { KERNEL_V3_1, getEntryPoint } from "@zerodev/sdk/constants"
import { signerToEcdsaValidator } from "@zerodev/ecdsa-validator"
import { http, createPublicClient, parseAbi, encodeFunctionData } from "viem"
import { sepolia } from "viem/chains"
import { privateKeyToAccount } from "viem/accounts"

// ERC20 ABI (minimal)
const erc20Abi = parseAbi([
  "function allowance(address owner, address spender) external view returns (uint256)",
])

export async function GET() {
  const privateKey = process.env.PRIVATE_KEY as `0x${string}`
  const ZERODEV_RPC = process.env.ZERODEV_RPC!

  console.log("privateKey", privateKey)
  console.log("ZERODEV_RPC from env:", process.env.ZERODEV_RPC)

  if (!privateKey || !ZERODEV_RPC) {
    return NextResponse.json({ error: "Missing env vars" }, { status: 500 })
  }

  const entryPoint = getEntryPoint("0.7")
  const kernelVersion = KERNEL_V3_1
  const chain = sepolia

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

export async function POST(req: Request) {
  try {
    const { calls } = await req.json()

    const privateKey = process.env.PRIVATE_KEY as `0x${string}`
    const ZERODEV_RPC = process.env.ZERODEV_RPC!

    if (!privateKey || !ZERODEV_RPC) {
      return NextResponse.json({ error: "Missing env vars" }, { status: 500 })
    }

    const entryPoint = getEntryPoint("0.7")
    const kernelVersion = KERNEL_V3_1
    const chain = sepolia

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

    // Log the calls for debugging
    console.log("UserOp calls:", JSON.stringify(calls, null, 2))

    // Support both encoded and unencoded call data
    const encodeCall = (call: any) => {
      if (typeof call.data === "string" && call.data.startsWith("0x")) {
        // Already encoded
        return { ...call, data: call.data }
      } else if (call.data && call.data.functionName) {
        // Unencoded, encode it
        return {
          ...call,
          data: encodeFunctionData({
            abi: erc20Abi,
            functionName: call.data.functionName,
            args: call.data.args,
          }),
        }
      }
      throw new Error("Invalid call data format")
    }

    // If there are two calls (approve + swap), send approve first and log result
    if (calls.length === 2) {
      try {
        const approveCallData = await account.encodeCalls([
          encodeCall(calls[0]),
        ])
        const approveUserOpHash = await client.sendUserOperation({
          callData: approveCallData,
          preVerificationGas: BigInt(70000),
        })
        console.log("Approve UserOp hash:", approveUserOpHash)

        try {
          const receipt = await client.waitForUserOperationReceipt({
            hash: approveUserOpHash,
          })
          console.log("Approve UserOp mined:", receipt)

          const allowance = await publicClient.readContract({
            address: calls[0].to, // token address
            abi: erc20Abi,
            functionName: "allowance",
            args: [account.address, calls[1].to], // owner, spender
          })
          console.log("Allowance after approve (on-chain):", allowance)

          const nonce = await publicClient.getTransactionCount({
            address: account.address,
          })
          console.log("Smart account nonce before swap:", nonce)

          console.log("Approve token address:", calls[0].to)
          console.log("Approve spender (MockSwap):", calls[1].to)
          console.log("Smart account address:", account.address)
          console.log("Allowance after approve:", allowance)
          console.log(
            "Swap amount:" /* extract from calls[1].data if possible */
          )

          // Add a delay to allow the bundler/paymaster to update state
          await new Promise((resolve) => setTimeout(resolve, 10000)) // 10 seconds

          // Now send the swap
          const swapCallData = await account.encodeCalls([encodeCall(calls[1])])
          const swapUserOpHash = await client.sendUserOperation({
            callData: swapCallData,
            preVerificationGas: BigInt(70000),
          })
          console.log("Swap UserOp hash:", swapUserOpHash)
          return NextResponse.json({ userOpHash: swapUserOpHash })
        } catch (e) {
          console.error("Approve UserOp not mined or failed:", e)
        }
      } catch (err: any) {
        console.error("API /api/smartaccount POST error:", err)
        if (err?.response) {
          try {
            const errorBody = await err.response.text()
            console.error("ZeroDev error body:", errorBody)
          } catch (e) {
            console.error("Failed to read ZeroDev error body", e)
          }
        }
        return NextResponse.json({ error: String(err) }, { status: 500 })
      }
    } else {
      // Single call (approve or swap only)
      try {
        const userOpHash = await client.sendUserOperation({
          calls: calls.map(encodeCall).map((call: any) => ({
            to: call.to,
            value: BigInt(0),
            data: call.data,
          })),
          preVerificationGas: BigInt(70000),
        })
        return NextResponse.json({ userOpHash })
      } catch (err: any) {
        console.error("API /api/smartaccount POST error:", err)
        if (err?.response) {
          try {
            const errorBody = await err.response.text()
            console.error("ZeroDev error body:", errorBody)
          } catch (e) {
            console.error("Failed to read ZeroDev error body", e)
          }
        }
        return NextResponse.json({ error: String(err) }, { status: 500 })
      }
    }
  } catch (err: any) {
    console.error("API /api/smartaccount POST error:", err)
    if (err?.response) {
      try {
        const errorBody = await err.response.text()
        console.error("ZeroDev error body:", errorBody)
      } catch (e) {
        console.error("Failed to read ZeroDev error body", e)
      }
    }
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
