import { SignInButton, useAuth, UserButton } from "@clerk/clerk-react"
import Link from "next/link"

export const Navbar = () => {
  const { isSignedIn } = useAuth()

  return (
    <>
      <nav className="flex items-center justify-between w-full px-2 border shadow-xl h-14 md:px-10">
        <Link href="/">
          <h3 className="text-xl font-bold md:text-2xl">Zentigra</h3>
        </Link>

        {isSignedIn ? (
          <UserButton />
        ) : (
          <>
            <SignInButton />
          </>
        )}
      </nav>
    </>
  )
}
