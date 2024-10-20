"use client"

import { Wrapper } from "@/components/Wrapper"
import { useDynamicContext } from "@dynamic-labs/sdk-react-core"
import { Greeting } from "@/components/Greeting"

const Page = () => {
  const { user } = useDynamicContext()
  return (
    <main>
      <Wrapper>
        <Greeting />
      </Wrapper>
    </main>
  )
}

export default Page
