import { SignInButton, useAuth, UserButton } from "@clerk/clerk-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect } from "react"

import { Button } from "~components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "~components/ui/select"

import AlertPopup from "./elements/AlertPopup"

const HideNavbar = [
  "/profile",
  "/auth/sign-in/[[...index]]",
  "/auth/sign-up/[[...index]]"
]

export const Navbar = () => {
  const router = useRouter()
  const { isSignedIn } = useAuth()

  const { setTheme, theme } = useTheme()

  useEffect(() => {
    setTheme("light")
  }, [])

  if (HideNavbar.includes(router.pathname)) return <></>

  return (
    <>
      <nav className="w-full border shadow-xl h-14">
        <div className="flex items-center justify-between w-11/12 mx-auto max-w-7xl h-14">
          <Link href="/">
            <h2 className="text-xl font-bold md:text-2xl">Zentigra</h2>
          </Link>

          <div className="flex gap-2.5 sm:gap-5">
            <Select defaultValue={theme} onValueChange={(e) => setTheme(e)}>
              <SelectTrigger className="w-20 h-8 py-0 border-none shadow focus:ring-transparent dark:shadow-slate-600">
                <SelectValue
                  placeholder={theme}
                  className="text-sm capitalize "
                />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="light">Light</SelectItem>
              </SelectContent>
            </Select>

            {isSignedIn ? (
              <UserButton />
            ) : (
              <>
                <Button variant="destructive" asChild>
                  <SignInButton />
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}
