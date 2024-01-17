import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react"
import { ClerkProvider } from "@clerk/nextjs"
import { useRouter } from "next/router"

const publicPages = ["/auth/sign-in/[[...index]]", "/auth/sign-up/[[...index]]"]

export const ClerkWrapper = ({ children }) => {
  const router = useRouter()
  const { pathname } = router

  const isPublicPage = publicPages.includes(pathname)

  return (
    <>
      <ClerkProvider>
        {isPublicPage ? (
          <>
            {children}

            <span className="fixed bottom-0 right-1/3">Public</span>
          </>
        ) : (
          <>
            <SignedIn>
              {children}
              <span className="fixed bottom-0 right-1/3">SignedIn</span>
            </SignedIn>

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
