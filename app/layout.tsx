import "./globals.css"
import "react-toastify/dist/ReactToastify.css"
import type { Metadata } from "next"
import { Inter as FontSans } from "next/font/google"
import Providers from "@/components/Providers"
import { Header } from "@/components/Header"
import { ToastContainer } from "react-toastify"
import { cn } from "@/lib/utils"
import { AnimatedBackground } from "@/components/ui/animated-blur-blob-background"

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
        <AnimatedBackground />
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
