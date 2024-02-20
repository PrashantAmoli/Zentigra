import { useUser } from "@clerk/clerk-react"

export const Welcome = () => {
  const userData = useUser()

  return (
    <>
      <div className="flex items-center justify-center w-full h-80">
        <h1 className="text-3xl font-bold text-center sm:text-5xl">
          Welcome to your Zentigra {userData?.user?.firstName}!
        </h1>
      </div>
    </>
  )
}

export default Welcome
