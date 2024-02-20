import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react"
import { ClerkProvider } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { useTheme } from "next-themes"
import { useRouter } from "next/router"
import { Toaster } from "sonner"

const publicPages = [
  "/auth/sign-in/[[...index]]",
  "/auth/sign-up/[[...index]]",
  "/popup",
  "/profile"
]

export const ClerkWrapper = ({ children }) => {
  const { theme } = useTheme()

  const router = useRouter()
  const { pathname } = router

  const isPublicPage = publicPages.includes(pathname)

  return (
    <>
      <Toaster
        theme={theme === "dark" ? "dark" : "light"}
        visibleToasts={7}
        position="bottom-center"
        richColors
        closeButton
      />

      <ClerkProvider
        appearance={{
          baseTheme: theme === "dark" ? dark : null,
          variables: {
            colorBackground: theme === "light" ? "white" : "#101010",
            borderRadius: "0.3"
          }
        }}
        signInUrl="/auth/sign-in"
        signUpUrl="/auth/sign-up"
        afterSignInUrl="/"
        afterSignUpUrl="/"
        navigate={(to) => router.push(to)}
        publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
        {isPublicPage ? (
          <>{children}</>
        ) : (
          <>
            <SignedIn>{children}</SignedIn>

            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        )}
      </ClerkProvider>
    </>
  )
}

export default ClerkWrapper
