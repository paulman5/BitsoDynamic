import { createWalletClient, custom } from "viem"
import { sepolia } from "viem/chains"

export let walletClient: ReturnType<typeof createWalletClient> | undefined

if (typeof window !== "undefined") {
  walletClient = createWalletClient({
    chain: sepolia,
    transport: custom(window.ethereum!),
  })
}
