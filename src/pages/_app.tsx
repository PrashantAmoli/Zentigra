import { ThemeProvider } from "next-themes"

import { Navbar } from "~components/Navbar"
import ClerkWrapper from "~components/wrappers/ClerkWrapper"

import "~styles/globals.css"

export default function App({ Component, pageProps }) {
  return (
    <>
      <ThemeProvider attribute="class">
        <ClerkWrapper>
          <main className="w-full overflow-x-hidden min-h-dvh bg-gradient-to-tr from-sky-50 via-white to-sky-50 dark:bg-gradient-to-tr dark:from-background dark:via-slate-950 dark:to-stone-950">
            <Navbar />

            <Component {...pageProps} />
          </main>
        </ClerkWrapper>
      </ThemeProvider>
    </>
  )
}
