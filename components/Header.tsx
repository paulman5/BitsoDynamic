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
  const { setShowAuthFlow, showAuthFlow, handleLogOut } =
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

        {/* Right: Connect Wallet */}
        <div className="flex items-center gap-4">
          {isConnected !== undefined ? (
            <>
              {isConnected && (
                <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg border border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-700">
                    {accountAddress}
                  </span>
                </div>
              )}
              {!isConnected ? (
                <Button
                  onClick={onConnect}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={onSettingsClick}>
                    <Settings className="w-4 h-4" />
                  </Button>
                  <div className="text-sm text-gray-600">
                    {smartAccount?.slice(0, 6)}...{smartAccount?.slice(-4)}
                  </div>
                </div>
              )}
            </>
          ) : (
            <Button
              onClick={() => setShowAuthFlow?.(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Wallet className="w-4 h-4 mr-2" />
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

export { Header }
