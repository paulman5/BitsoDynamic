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
    <header className="sticky top-0 z-50 bg-transparent backdrop-blur-xl border-0">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent cursor-pointer transition-opacity hover:opacity-80 tracking-tight">
              SwapFlow
            </span>
          </div>
        </Link>

        {/* Right: Wallet Widget */}
        <div className="flex items-center gap-4">
          <DynamicWidget buttonClassName="rounded-xl bg-blue-600 hover:bg-indigo-600 text-white font-semibold px-4 py-2 shadow-md transition-all" />
        </div>
      </div>
    </header>
  )
}

export { Header }
