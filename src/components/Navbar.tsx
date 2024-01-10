import { SignInButton, useAuth, UserButton } from "@clerk/clerk-react"

export const Navbar = () => {
  const { isSignedIn } = useAuth()

  return (
    <>
      <nav className="w-full h-14 shadow-xl border flex justify-between items-center px-2 md:px-10">
        <h3 className="text-xl md:text-2xl font-bold">Zentigra</h3>

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
