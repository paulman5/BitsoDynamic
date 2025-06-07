"use client"

import React from "react"
import { DynamicWidget } from "@dynamic-labs/sdk-react-core"
import { Wallet } from "lucide-react"
import Link from "next/link"

type HeaderProps = {
  isConnected?: boolean
  smartAccount?: string
  onConnect?: () => void
  onSettingsClick?: () => void
}

const Header: React.FC<HeaderProps> = () => {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent cursor-pointer transition-opacity hover:opacity-80">
              SwapFlow
            </span>
          </div>
        </Link>

        {/* Right: Wallet Widget */}
        <div className="flex items-center gap-4">
          <DynamicWidget />
        </div>
      </div>
    </header>
  )
}

export { Header }
