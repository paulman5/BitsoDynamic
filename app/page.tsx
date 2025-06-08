"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SpotlightCard } from "@/components/ui/spotlight-card"
import { LucideZap, LucideSparkles, LucideRefreshCw } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-16 px-4">
      {/* Hero Section */}
      <div className="w-full max-w-3xl text-center mb-8 mt-8">
        <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-500 bg-clip-text text-transparent drop-shadow-lg animate-fade-in">
          SwapFlow
        </h1>
        <p className="mt-4 text-lg md:text-2xl text-gray-700 font-medium animate-fade-in delay-100">
          Gasless, seamless, and modern token swaps.
          <br />
          Powered by ZeroDev Smart Wallets & Dynamic.
        </p>
      </div>
      {/* Launch App Button */}
      <div className="w-full flex justify-center mb-10 animate-fade-in delay-200">
        <Link href="/swap" className="w-full max-w-xs">
          <Button
            size="lg"
            className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-purple-600 via-indigo-700 to-blue-700 shadow-lg transition-all duration-300 rounded-2xl border-blue-200 focus:outline-none focus:ring-4 focus:ring-purple-300/40 hover:shadow-2xl relative overflow-hidden group"
          >
            <span className="relative z-10">Launch App</span>
            <span className="absolute inset-0 z-0 bg-gradient-to-r from-purple-400/30 via-indigo-400/20 to-blue-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg rounded-2xl" />
          </Button>
        </Link>
      </div>
      {/* Feature Cards */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 animate-fade-in delay-300">
        <SpotlightCard
          className="bg-white border border-blue-100 rounded-3xl shadow-lg p-8 flex flex-col items-center gap-4 hover:scale-[1.03] hover:shadow-2xl transition-transform duration-300 group"
          spotlightColor="#ffe06680"
        >
          <span className="mb-2">
            <LucideZap className="text-yellow-500 w-10 h-10 group-hover:scale-110 transition-transform" />
          </span>
          <span className="font-bold text-xl text-blue-700">Gasless UX</span>
          <span className="text-gray-600 text-base text-center">
            No gas fees. Experience seamless, sponsored transactions.
          </span>
        </SpotlightCard>
        <SpotlightCard
          className="bg-white border border-blue-100 rounded-3xl shadow-lg p-8 flex flex-col items-center gap-4 hover:scale-[1.03] hover:shadow-2xl transition-transform duration-300 group"
          spotlightColor="#a066ff80"
        >
          <span className="mb-2">
            <LucideSparkles className="text-indigo-500 w-10 h-10 group-hover:scale-110 transition-transform" />
          </span>
          <span className="font-bold text-xl text-blue-700">Modern Web3</span>
          <span className="text-gray-600 text-base text-center">
            Smart wallets, beautiful UI, and next-gen user experience.
          </span>
        </SpotlightCard>
        <SpotlightCard
          className="bg-white border border-blue-100 rounded-3xl shadow-lg p-8 flex flex-col items-center gap-4 hover:scale-[1.03] hover:shadow-2xl transition-transform duration-300 group"
          spotlightColor="#66e0ff80"
        >
          <span className="mb-2">
            <LucideRefreshCw className="text-purple-500 w-10 h-10 group-hover:scale-110 transition-transform" />
          </span>
          <span className="font-bold text-xl text-blue-700">
            Effortless Swaps
          </span>
          <span className="text-gray-600 text-base text-center">
            Swap tokens instantly with a single click.
          </span>
        </SpotlightCard>
      </div>
    </div>
  )
}
