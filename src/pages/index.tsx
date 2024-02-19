import { useEffect, useState } from "react"

import { Separator } from "~components/ui/separator"
import Sequences from "~components/views/Sequences"
import Welcome from "~components/views/Welcome"
import { supabase } from "~supabase"

function IndexPage() {
  const [users, setUsers] = useState<unknown>([]) // <-- add this line

  chrome.runtime?.onMessage?.addListener(() => {
    console.log("message received in next app index.tsx")
  })

  chrome.runtime?.onMessage?.addListener(
    function (message, sender, sendResponse) {
      console.info("message received in next app", message)
      if (message.action === "backgroundToPopup") {
        console.log("Message from background script:", message.data)

        // Do the DB call here
      }
    }
  )

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from("users").select("*")
      setUsers(data)
    }
    fetchUsers()
  }, [])

  return (
    <>
      <main className="w-full min-h-screen overflow-x-hidden">
        <Welcome />

        <Separator className="w-full mx-auto max-w-7xl" />

        <Sequences />
      </main>
    </>
  )
}

export default IndexPage
