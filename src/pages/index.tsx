import { useEffect, useState } from "react"

import { Main } from "~components/views/main"
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
      <Welcome />

      <Main name="App" />

      <pre>{JSON.stringify(users, null, 2)}</pre>
    </>
  )
}

export default IndexPage
