import { createWalletClient, custom } from "viem"
import { baseSepolia } from "viem/chains"

export const walletClient = createWalletClient({
  chain: baseSepolia,
  transport: custom(window.ethereum!),
})
export let account: string

async function initAccount() {
  ;[account] = await walletClient.getAddresses()
}
initAccount()
