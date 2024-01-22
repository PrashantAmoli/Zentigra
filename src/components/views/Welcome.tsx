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
      <div className="w-full h-80 flex justify-center items-center">
        <h1 className="text-center text-5xl font-bold">
          Welcome to your Zentigra {userData?.user?.firstName}!
        </h1>
      </div>
    </>
  )
}

export default Welcome
