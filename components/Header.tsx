import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Wrapper } from "./Wrapper"
import { DynamicWidget } from "@dynamic-labs/sdk-react-core"

const Header = () => {
  return (
    <header className="HEADER py-8 border-b mb-10">
      <Wrapper>
        <div className="flex items-center justify-between">
          <h1 className="text-lg md:text-xl font-bold">
            Solidity Next.js Starter
          </h1>
          <DynamicWidget />
        </div>
      </Wrapper>
    </header>
  )
}

export { Header }
