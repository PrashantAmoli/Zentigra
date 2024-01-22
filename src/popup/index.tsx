import "~styles/globals.css"

import { ClerkProvider, SignedIn, SignedOut } from "@clerk/chrome-extension"

import { Main } from "~components/views/main"
import Welcome from "~components/views/Welcome"
import ClerkWrapper from "~components/wrappers/ClerkWrapper"

function IndexPopup() {
  return (
    <>
      {/* <ClerkProvider
        publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}> */}
      {/* <ClerkWrapper> */}
      <main className="min-w-96 h-96 flex justify-center items-center">
        <Main />
      </main>

      {/* <SignedIn>
        <span className="fixed bottom-0 right-1/3">SignedIn</span>
      </SignedIn>

      <SignedOut>
        <span className="fixed bottom-0 right-1/3">SignedOut</span>
      </SignedOut> */}
      {/* </ClerkWrapper> */}
      {/* </ClerkProvider> */}
    </>
  )
}

export default IndexPopup
