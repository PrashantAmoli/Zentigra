import { ThemeProvider } from "next-themes"
import { Toaster } from "sonner"

import { Navbar } from "~components/Navbar"
import ClerkWrapper from "~components/wrappers/ClerkWrapper"

import "~styles/globals.css"

export default function App({ Component, pageProps }) {
  return (
    <>
      <ThemeProvider attribute="class">
        <ClerkWrapper>
          <Navbar />

          <Component {...pageProps} />

          <Toaster position="bottom-center" richColors closeButton />
        </ClerkWrapper>
      </ThemeProvider>
    </>
  )
}
