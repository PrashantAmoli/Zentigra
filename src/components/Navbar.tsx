import { SignInButton, useAuth, UserButton } from "@clerk/clerk-react"
import { useTheme } from "next-themes"
import Link from "next/link"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "~components/ui/select"

import { Button } from "./ui/button"

export const Navbar = () => {
  const { isSignedIn } = useAuth()

  const { setTheme, themes, theme } = useTheme()

  return (
    <>
      <nav className="flex items-center justify-between w-full px-2 border shadow-xl h-14 md:px-10">
        <Link href="/">
          <h3 className="text-xl font-bold md:text-2xl">Zentigra</h3>
        </Link>

        <div className="flex gap-3 md:gap-5">
          <Select defaultValue={"light"} onValueChange={(e) => setTheme(e)}>
            <SelectTrigger className="border-none shadow focus:ring-transparent dark:shadow-slate-600">
              <SelectValue placeholder={theme} className="capitalize " />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>

          {isSignedIn ? (
            <UserButton />
          ) : (
            <>
              <SignInButton />
            </>
          )}
        </div>
      </nav>
    </>
  )
}
