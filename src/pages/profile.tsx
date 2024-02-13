import { SignInButton, SignOutButton, useUser } from "@clerk/clerk-react"
import Link from "next/link"

import { Button } from "~components/ui/button"

export default function Home() {
  const userData = useUser()

  return (
    <div className="fixed inset-0 z-30 flex flex-col items-center justify-center w-full bg-white">
      {userData.isSignedIn ? (
        <>
          <p className="w-fit">{userData?.user?.fullName}</p>

          <p className="w-fit">
            {userData?.user?.emailAddresses[0].emailAddress}
          </p>

          <Button variant="destructive" className="w-fit">
            <SignOutButton />
          </Button>
        </>
      ) : (
        <Link href={"/auth/sign-in"} target="_blank">
          <Button className="w-fit">Sign In</Button>
        </Link>
      )}

      {/* <pre className="w-full break-all">
        {JSON.stringify(userData, null, 2)}
      </pre> */}
    </div>
  )
}
