import { FaGooglePlay, FaStopCircle } from "react-icons/fa"

import { Button } from "~/components/ui/button"

// popup
export function Main() {
  const changeRecordingState = (newState) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      console.log("inside the tab function")
      const activeTabId = tabs[0].id
      chrome.tabs.sendMessage(activeTabId, { action: newState })
    })

    chrome.runtime.sendMessage({ action: "RECORDING_STATE", data: newState })

    const delay = newState === "start" ? 1000 : 4000

    setTimeout(() => window.close(), delay)
  }

  return (
    <>
      <div className="flex w-full gap-1 p-2 justify-evenly">
        <Button
          onClick={() => changeRecordingState("start")}
          variant="default"
          className="flex gap-1">
          Start <FaGooglePlay />
        </Button>

        <Button
          onClick={() => changeRecordingState("stop")}
          variant="destructive"
          className="flex gap-1">
          Stop <FaStopCircle />
        </Button>
      </div>
    </>
  )
}
