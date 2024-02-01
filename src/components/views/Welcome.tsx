import { useUser } from "@clerk/clerk-react"

type UserData = {
  emailAddresses: unknown[]
  isSignedIn: boolean
  isLoaded: boolean
}

export const Welcome = () => {
  const userData = useUser()

  return (
    <>
      <div className="flex items-center justify-center w-full h-80">
        <h1 className="text-5xl font-bold text-center">
          Welcome to your Zentigra {userData?.user?.firstName}!
        </h1>
      </div>
    </>
  )
}

export default Welcome
