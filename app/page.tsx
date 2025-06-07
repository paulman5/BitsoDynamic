"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-50 to-white relative overflow-hidden pt-24">
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-blue-400 via-indigo-300 to-indigo-500 opacity-30 rounded-full blur-3xl z-0 animate-float-slow" />
      <div className="absolute top-1/3 left-1/2 w-[300px] h-[300px] bg-gradient-to-tr from-purple-200 via-blue-200 to-pink-200 opacity-20 rounded-full blur-2xl z-0 animate-float" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tr from-pink-300 to-purple-400 opacity-20 rounded-full blur-2xl z-0 animate-float-reverse" />
      <div className="max-w-2xl w-full px-8 py-20 bg-white/70 rounded-3xl shadow-2xl backdrop-blur-md flex flex-col items-center z-10 border border-blue-100 transition-all duration-300">
        <h1 className="text-5xl md:text-6xl font-extrabold text-center mb-4 bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-500 bg-clip-text text-transparent drop-shadow-lg animate-fade-in">
          SwapFlow
        </h1>
        <p className="text-xl text-gray-700 text-center mb-6 font-semibold tracking-wide animate-fade-in delay-100">
          Gasless, seamless, and modern token swaps.
          <br />
          Powered by ZeroDev Smart Wallets & Dynamic.
        </p>
        <div className="flex flex-col md:flex-row gap-4 w-full justify-center mb-8 animate-fade-in delay-200">
          <FeatureCard
            icon="⚡"
            title="Gasless UX"
            desc="No gas fees. Experience seamless, sponsored transactions."
          />
          <FeatureCard
            icon="✨"
            title="Modern Web3"
            desc="Smart wallets, beautiful UI, and next-gen user experience."
          />
          <FeatureCard
            icon="🔄"
            title="Effortless Swaps"
            desc="Swap tokens instantly with a single click."
          />
        </div>
        <Link href="/swap" className="w-full">
          <Button
            size="lg"
            className="w-full h-16 text-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl transition-all duration-200 rounded-2xl border-2 border-blue-200 animate-fade-in delay-300"
          >
            Launch App
          </Button>
        </Link>
      </div>
      <div className="absolute inset-0 pointer-events-none z-20">
        <Sparkles />
      </div>
      <div className="h-24 w-full" />
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: string
  title: string
  desc: string
}) {
  return (
    <div className="flex-1 min-w-[180px] bg-white/70 border border-blue-100 rounded-xl shadow-md p-4 flex flex-col items-center gap-2 backdrop-blur-sm hover:scale-105 transition-transform">
      <span className="text-3xl mb-1">{icon}</span>
      <span className="font-bold text-lg text-blue-700">{title}</span>
      <span className="text-gray-600 text-sm text-center">{desc}</span>
    </div>
  )
}

function Sparkles() {
  return (
    <>
      <div
        className="absolute left-1/4 top-1/3 w-2 h-2 bg-yellow-300 rounded-full opacity-70 animate-pulse"
        style={{ animationDuration: "2.5s" }}
      />
      <div
        className="absolute right-1/3 top-1/4 w-1.5 h-1.5 bg-pink-300 rounded-full opacity-60 animate-pulse"
        style={{ animationDuration: "3.2s" }}
      />
      <div
        className="absolute left-1/2 bottom-1/4 w-2 h-2 bg-blue-400 rounded-full opacity-50 animate-pulse"
        style={{ animationDuration: "2.1s" }}
      />
      <div
        className="absolute right-1/4 bottom-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-60 animate-pulse"
        style={{ animationDuration: "2.8s" }}
      />
    </>
  )
}
