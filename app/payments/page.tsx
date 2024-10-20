import React from "react"
import { useUserWallets, useDynamicContext } from "@dynamic-labs/sdk-react-core"
import type { Wallet } from "@dynamic-labs/sdk-react-core"

export default function Payments() {
  const { user } = useDynamicContext()

  return (
    <div>
      Payments
      {user?.email}
    </div>
  )
}
