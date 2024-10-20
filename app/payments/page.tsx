import React from "react"
import { useUserWallets } from "@dynamic-labs/sdk-react-core"
import type { Wallet } from "@dynamic-labs/sdk-react-core"
import { useDynamicContext } from "@dynamic-labs/sdk-react"

export default function Payments() {
  const { user } = useDynamicContext()

  return (
    <div>
      Payments
      {user?.email}
    </div>
  )
}
