import { useUser } from "@clerk/clerk-react"
import { useEffect, useState } from "react"

type UserData = {
  emailAddresses: unknown[]
  isSignedIn: boolean
  isLoaded: boolean
}

export function Main({ name = "Extension" }) {
  // const userData = useUser()

  useEffect(() => {
    chrome.runtime?.onMessage?.addListener(
      function (message, sender, sendResponse) {
        if (message.action === "backgroundToPopup") {
          console.log("Message from background script:", message.data)

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
    <div>
      <div id="id1">-</div>
      <button onClick={() => changeState("start")}>Start</button>
      {/* <button onClick={()=>changeState('pause')}>Pause</button> */}
      <button onClick={() => changeState("stop")}>Stop</button>

      <div className="w-full h-80 flex justify-center items-center">
        <h1 className="text-center text-5xl font-bold">
          Welcome to your Zentigra
          {/* {userData.user?.firstName}! */}
        </h1>
      </div>
    </div>
  )
}
