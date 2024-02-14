export {}

const frontendUrl =
  process.env.PLASMO_PUBLIC_FRONTEND_URL || "https://localhost:1947"

console.log(
  "Live now; make now always the most precious time. Now will never come again."
)

const openPopup = () => {
  chrome.tabs.create({
    url: chrome.runtime.getURL("/popup.html")
  })
}

const openPreviewPage = () => {
  chrome.tabs.create({
    url: frontendUrl
      ? `${frontendUrl}/preview`
      : "http://localhost:1947/preview"
  })
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "contentScriptToPopup") {
    // openPopup()
    openPreviewPage()

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
      // chrome.tabs.query(
      //   {
      //     url: frontendUrl
      //       ? `${frontendUrl}/preview`
      //       : "http://localhost:1947/preview",
      //     currentWindow: true
      //     // active: true
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
      // window.postMessage(
      //   {
      //     action: "backgroundToPreview",
      //     data: message.data,
      //     command: message.command
      //   },
      //   "*"
      // )
    }, 5000)
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
    chrome.tabs.query({ active: true }, (tabDetails) => {
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
