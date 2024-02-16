import { SignInButton, SignOutButton, useUser } from "@clerk/clerk-react"
import Link from "next/link"
import { useEffect, useState } from "react"

import { Button } from "~components/ui/button"

export default function Home() {
  const userData = useUser()

  useEffect(() => {
    window.onmessage = (event) => {
      if (event.data.command === "auth-status") {
        console.log("CS=>Next.js:", event.data)

        // send the auth status response to the extension
        parent.postMessage(
          {
            command: "auth-status",
            data: { isSignedIn: userData.isSignedIn }
          },
          "*"
        )
      }
    }
  }, [userData])

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
    </div>
  )
}
