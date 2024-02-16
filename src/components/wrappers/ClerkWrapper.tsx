import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react"
import { ClerkProvider } from "@clerk/nextjs"
import { useRouter } from "next/router"

const publicPages = [
  "/auth/sign-in/[[...index]]",
  "/auth/sign-up/[[...index]]",
  "/popup",
  "/profile"
]

export const ClerkWrapper = ({ children }) => {
  const router = useRouter()
  const { pathname } = router

  const isPublicPage = publicPages.includes(pathname)

  return (
    <>
      <ClerkProvider
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
