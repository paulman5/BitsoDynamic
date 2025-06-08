import "./globals.css"
import "react-toastify/dist/ReactToastify.css"
import type { Metadata } from "next"
import { Inter as FontSans } from "next/font/google"
import Providers from "@/components/Providers"
import { Header } from "@/components/Header"
import { ToastContainer } from "react-toastify"
import { cn } from "@/lib/utils"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})
export const metadata: Metadata = {
  title: "SwapFlow",
  description:
    "A gasless, seamless, and modern token swap dapp powered by ZeroDev Smart Wallets & Dynamic",
}

const ZERODEV_RPC = process.env.ZERODEV_RPC

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  console.log("the RPC URL is", ZERODEV_RPC)
  console.log(
    "the environment ID is",
    process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID
  )

  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased relative overflow-x-hidden",
          fontSans.variable
        )}
      >
        {/* Vibrant, blurred, animated background for all pages */}
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_0%,rgba(99,102,241,0.22)_0%,rgba(236,72,153,0.13)_40%,rgba(255,255,255,0.95)_100%)]">
          <div className="absolute -top-60 -left-60 w-[700px] h-[700px] bg-gradient-to-br from-blue-500 via-indigo-400 to-indigo-700 opacity-30 rounded-full blur-[120px] z-0 animate-float-slow" />
          <div className="absolute top-1/4 left-2/3 w-[350px] h-[350px] bg-gradient-to-tr from-purple-300 via-blue-200 to-pink-300 opacity-20 rounded-full blur-[90px] z-0 animate-float" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tr from-pink-400 to-purple-500 opacity-25 rounded-full blur-[100px] z-0 animate-float-reverse" />
          <div className="pointer-events-none absolute inset-0 z-0 bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-blue-200 via-fuchsia-100 to-transparent opacity-40 animate-gradient-move" />
        </div>
        <Providers>
          <div className="relative z-10">
            <Header />
            {children}
          </div>
        </Providers>
        <ToastContainer />
      </body>
    </html>
  )
}
