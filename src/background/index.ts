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
  } else if ( message.title ){

    let { x, y, page_url, title, description } = message;

    chrome.tabs.captureVisibleTab(null, { format: 'png' }, function(dataUrl) {
      console.log('this is the image: ', dataUrl)

      chrome.storage.local.get(["image"]).then((result) => {
        let imageString = result["image"]

        if (imageString == null) {
          imageString = "[]"
        }

        let imageArray = JSON.parse(imageString)
        imageArray.push({
          image: dataUrl,
          x,
          y,
          page_url,
          title,
          description
        })
        imageString = JSON.stringify(imageArray)

        chrome.storage.local.set({ image: imageString }).then(() => {
          console.log("Value is set")
        })
      })
    });
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
      url: frontendUrl || "https://zentigra.vercel.app"
    })
  } else if (details.reason === "update") {
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
