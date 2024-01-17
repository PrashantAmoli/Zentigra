import { Toaster } from "sonner"

import ClerkWrapper from "~components/ClerkWrapper"
import { Navbar } from "~components/Navbar"

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
