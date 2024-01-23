import { SignInButton, SignOutButton } from "@clerk/clerk-react"
import { useEffect, useState } from "react"

import { supabase } from "~supabase"

import { Button } from "../ui/button"

// popup
export function Main({ name = "Extension" }) {
  const [sequencePreview, setSequencePreview] = useState<string[]>([])

  useEffect(() => {
    // chrome.runtime?.onMessage?.addListener(
    //   function (message, sender, sendResponse) {
    //     if (message.action === "backgroundToPopup") {
    //       console.log("Message from background script:", message)
    //       setSequencePreview(message.data)
    //       // Do the DB call here
    //     }
    //   }
    // )
  }, [])

  chrome.runtime?.onMessage?.addListener(
    function (message, sender, sendResponse) {
      if (message.action === "backgroundToPopup") {
        console.log("Message from background script:", message)

        setSequencePreview(message.data)
        // Do the DB call here
      }
    }
  )

  const uploadSequence = async () => {
    // create a sequence
    const { data, error } = await supabase.from("sequences").select("*")

    if (error) {
      console.log(error)
    } else {
      console.log("Sequences in DB: ", data)
    }

    // use the newly generated sequence id to upload the steps of the sequence to the steps table
  }

  const changeState = (newState) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      console.log("inside the tab function")
      const activeTabId = tabs[0].id
      chrome.tabs.sendMessage(activeTabId, { action: newState })
    })
  }

  return (
    <>
      <div className="flex flex-col w-full justify-center items-center gap-1 p-2">
        <div id="id1">-</div>

        <Button onClick={() => changeState("start")}>Start</Button>
        <Button onClick={() => changeState("stop")}>Stop</Button>

        <pre>{JSON.stringify(sequencePreview)}</pre>

        <div className="flex flex-col gap-5 w-full">
          {sequencePreview.length === 0 ? null : (
            <>
              {sequencePreview?.map((image, key) => {
                return <img src={image} key={key} className="w-44 my-4" />
              })}
            </>
          )}
        </div>
      </div>

      {/* <button onClick={() => changeState("start")}>Start</button> */}
      {/* <button onClick={()=>changeState('pause')}>Pause</button> */}
      {/* <button onClick={() => changeState("stop")}>Stop</button> */}
    </>
  )
}
