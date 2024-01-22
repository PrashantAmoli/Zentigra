import { Toaster } from "sonner"

import { Navbar } from "~components/Navbar"
import ClerkWrapper from "~components/wrappers/ClerkWrapper"

import "~styles/globals.css"

export default function App({ Component, pageProps }) {
  return (
    <>
      <ClerkWrapper>
        <Navbar />

        <Component {...pageProps} />
      </ClerkWrapper>

      <Toaster position="bottom-center" />
    </>
  )
}
