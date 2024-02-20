import { SignUp } from "@clerk/nextjs"
import Head from "next/head"

export default function SignUpPage() {
  return (
    <>
      <Head>
        <title>Sign Up | Zentigra</title>
      </Head>

      <main className="fixed inset-0 flex items-center justify-center w-full px-2 ">
        <SignUp
          path="/auth/sign-up"
          routing="path"
          afterSignUpUrl="/"
          appearance={{
            elements: {}
          }}
        />
      </main>
    </>
  )
}
