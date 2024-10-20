"use client"

import React, { useEffect } from "react"
import { Wrapper } from "./Wrapper"
import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core"

const Header = () => {
  const { setShowAuthFlow, showAuthFlow, handleLogOut } = useDynamicContext()
  useEffect(() => {
    setShowAuthFlow(true)
    console.log("showAuthFlow", showAuthFlow)
  }, [showAuthFlow])

  console.log("showAuthFlow button click", showAuthFlow)
  return (
    <header className="HEADER py-8 border-b mb-10">
      <Wrapper>
        <div className="flex items-center justify-between">
          <h1 className="text-lg md:text-xl font-bold">Your Voice Companion</h1>
          <button onClick={() => setShowAuthFlow(true)}>Login</button>
          <button onClick={() => handleLogOut()}>Logout</button>
          {/* <DynamicWidget /> */}
          {showAuthFlow && <DynamicWidget />}
        </div>
      </Wrapper>
    </header>
  )
}

export { Header }
