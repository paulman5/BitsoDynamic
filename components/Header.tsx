"use client"

import React from "react"
import { Wrapper } from "./Wrapper"
import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core"
import { Button } from "@/components/ui/button"
import { Settings, Wallet } from "lucide-react"
import { useSmartAccount } from "@/hooks/useSmartaccount"

type HeaderProps = {
  isConnected?: boolean
  smartAccount?: string
  onConnect?: () => void
  onSettingsClick?: () => void
}

const Header: React.FC<HeaderProps> = ({
  isConnected,
  smartAccount,
  onConnect,
  onSettingsClick,
}) => {
  // Dynamic context for login/logout, only used if not in swap page
  const { setShowAuthFlow, showAuthFlow, handleLogOut, primaryWallet } =
    useDynamicContext?.() || {}

  const { accountAddress } = useSmartAccount()

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            SwapFlow
          </h1>
        </div>
        {/* Right: Wallet Widget */}
        <div className="flex items-center gap-4">
          <DynamicWidget />
        </div>
      </div>
    </header>
  )
}

export { Header }
