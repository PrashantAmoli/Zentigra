export {}

let RecordingState = "stop"
const frontendUrl =
  process.env.PLASMO_PUBLIC_FRONTEND_URL || "http://localhost:1947"

console.log(
  "Live now; make now always the most precious time. Now will never come again."
)

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "RECORDING_STATE") {
    if (message.data !== RecordingState) RecordingState = message.data
  } else if (message.action === "PREVIEW_SEQUENCE") {
    chrome.tabs
      .create({
        url: `${frontendUrl}/preview`
      })
      .then((tab) => {
        setTimeout(() => {
          // send only to the newly created preview tab
          chrome.tabs.sendMessage(tab.id, {
            action: "backgroundToPreview",
            command: "all-tabs",
            data: message.data
          })
        }, 9000)
      })
  } else if (message.action === "contentScriptToPopup") {
    // Log the message received from the content script
    console.log("Message from content script:", message.command, message.data)

    setTimeout(() => {
      // Send the message to the popup
      // chrome.runtime.sendMessage({
      //   action: "backgroundToPopup",
      //   data: message.data,
      //   command: message.command
      // })
      // Send the message to the preview page
    }, 5000)
  } else if (message.action === "CAPTURE") {
    // Capture the current tab
    chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
      // Log the data URL of the captured tab
      console.log("Captured tab:", dataUrl)

      sendResponse({ data: dataUrl })

      if (chrome.runtime.lastError) {
        // Handle any error that occurred while capturing the tab
        console.error(chrome.runtime.lastError.message)
      }

      // Save the data URL to the local storage
      // chrome.storage.local.set({ image: dataUrl }, () => {
      //   // Log the result of saving the data URL
      //   console.log("Image saved to local storage")
      // })
    })
  }
})

// Listen for tab activation changes
chrome.tabs.onActivated.addListener((activeInfo) => {
  // Get the tab ID of the activated tab
  const tabId = activeInfo.tabId

  // Send a message to the active tab
  chrome.tabs.sendMessage(
    tabId,
    { action: "TAB_SWITCHED", data: RecordingState },
    (response) => {
      if (chrome.runtime.lastError) {
        // Handle any error that occurred while sending the message
        console.error(chrome.runtime.lastError.message)
      } else {
        // Log the response received from the content script (if any)
        console.log("Message sent to active tab:", response)
      }
    }
  )
})

chrome.runtime.onInstalled.addListener(function (details) {
  // open onboarding page
  console.log("Zentigra Installed ", details)
  if (details.reason === "install") {
    chrome.tabs.create({
      url: frontendUrl || "http://localhost:1947"
    })
  } else if (details.reason === "update") {
    chrome.runtime.restart()

    chrome.tabs.query({}, (tabDetails) => {
      //sends messages to all active tabs for now
      console.log("tabDetails: ", tabDetails)

      tabDetails.forEach((tab) => {
        chrome.scripting.executeScript(
          {
            target: {
              tabId: tab.id
            },
            world: "MAIN", // MAIN in order to access the window object
            files: ["/src/contents/content.ts"]
          },
          () => {
            console.log("Background script got callback after injection")
          }
        )
      })
    })

    chrome.tabs.query({ active: false }, (tabDetails) => {
      //sends messages to all active tabs for now
      tabDetails.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, {
          command: "all-tabs",
          payload: "Zentigra Updated: from background script to all tabs!"
        })
      })
    })
  }
})
