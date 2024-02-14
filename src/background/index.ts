export {}

const frontendUrl =
  process.env.PLASMO_PUBLIC_FRONTEND_URL || "https://localhost:1947"

console.log(
  "Live now; make now always the most precious time. Now will never come again."
)

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "contentScriptToPopup") {
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
  } else if (message.action === "contentScriptToPreview") {
    chrome.tabs
      .create({
        url: frontendUrl
          ? `${frontendUrl}/preview`
          : "http://localhost:1947/preview"
      })
      .then((tab) => {
        console.log("Preview Tab: ", tab.id)

        setTimeout(() => {
          // send only to the newly created preview tab
          chrome.tabs.sendMessage(tab.id, {
            action: "backgroundToPreview",
            command: "all-tabs",
            data: message.data
          })
        }, 9000)

        // send to all preview tabs
        // chrome.tabs.query(
        //   {
        //     url: frontendUrl
        //       ? `${frontendUrl}/preview`
        //       : "http://localhost:1947/preview"
        //   },
        //   (tabDetails) => {
        //     console.log("Preview Tabs: ", tabDetails)

        //     //sends messages to all active tabs for now
        //     tabDetails.forEach((tab) => {
        //       chrome.tabs.sendMessage(tab.id, {
        //         action: "backgroundToPreview",
        //         command: "all-tabs",
        //         data: message.data
        //       })
        //     })
        //   }
        // )
      })
  }
})

chrome.runtime.onInstalled.addListener(function (details) {
  // open onboarding page
  console.log("Zentigra Installed ", details)
  if (details.reason === "install") {
    chrome.tabs.create({
      url: frontendUrl ? `${frontendUrl}` : "https://zentigra.com"
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
