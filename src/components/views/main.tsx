import { SignInButton, SignOutButton } from "@clerk/clerk-react"
import { useEffect, useState } from "react"

import { Button } from "../ui/button"

// popup
export function Main({ name = "Extension" }) {
  const [sequencePreview, setSequencePreview] = useState<string[]>([])

  useEffect(() => {
    chrome.runtime?.onMessage?.addListener(
      function (message, sender, sendResponse) {
        if (message.action === "backgroundToPopup") {
          console.log("Message from background script:", message)

          setSequencePreview(message.data)
          // Do the DB call here
        }
      }
    )
  }, [])

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
                return <img src={image} key={key} className="w-44 my-5" />
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
