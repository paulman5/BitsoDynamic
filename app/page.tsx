"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-xl w-full px-6 py-16 bg-white/80 rounded-3xl shadow-2xl backdrop-blur-md flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Welcome to SwapFlow
        </h1>
        <p className="text-lg text-gray-700 text-center mb-8">
          Effortless, gasless token swaps powered by ZeroDev Smart Wallets and
          Dynamic. Connect, swap, and experience the next generation of Web3 UX.
        </p>
        <Link href="/swap">
          <Button
            size="lg"
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg transition-all duration-200"
          >
            Launch App
          </Button>
        </Link>
      </div>
    </div>
  )
}
