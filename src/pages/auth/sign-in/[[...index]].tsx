import { SignIn } from "@clerk/nextjs"
import Head from "next/head"

export default function SignInPage() {
  return (
    <>
      <Head>
        <title>Sign In | Zentigra</title>
      </Head>

      <main className="fixed inset-0 flex items-center justify-center w-full px-2 ">
        <SignIn
          path="/auth/sign-in"
          routing="path"
          afterSignInUrl="/"
          appearance={{
            elements: {}
          }}
        />
      </main>
    </>
  )
}
