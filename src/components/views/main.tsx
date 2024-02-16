import { Button } from "~/components/ui/button"

// popup
export function Main() {
  chrome.runtime?.onMessage?.addListener(
    function (message, sender, sendResponse) {
      if (message.action === "backgroundToPopup")
        console.log("Message from background script:", message)
    }
  )

  const changeRecordingState = (newState) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      console.log("inside the tab function")
      const activeTabId = tabs[0].id
      chrome.tabs.sendMessage(activeTabId, { action: newState })
    })

    const delay = newState === "start" ? 1000 : 4000

    setTimeout(() => window.close(), delay)
  }

  return (
    <>
      <div className="flex w-full gap-1 p-2 justify-evenly">
        <Button onClick={() => changeRecordingState("start")}>Start</Button>
        <Button onClick={() => changeRecordingState("stop")}>Stop</Button>
      </div>
    </>
  )
}
