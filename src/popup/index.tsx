import "~styles/globals.css"

import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton
} from "@clerk/clerk-react"

// import { Toaster } from "sonner"

import { Button } from "~components/ui/button"
import { Main } from "~components/views/main"

function IndexPopup() {
  return (
    <>
      <main className="flex items-center justify-center w-full overflow-x-hidden min-w-96 h-96">
        <ClerkProvider publishableKey="pk_test_ZXZpZGVudC1nb2JibGVyLTUuY2xlcmsuYWNjb3VudHMuZGV2JA">
          <SignInButton>
            <Button>Sign in</Button>
          </SignInButton>

          <Main />
        </ClerkProvider>

        {/* <Toaster position="bottom-center" /> */}
      </main>
    </>
  )
}

export default IndexPopup
