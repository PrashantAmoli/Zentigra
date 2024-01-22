export {}

console.log(
  "Live now; make now always the most precious time. Now will never come again."
)

const openPopup = () => {
  const url = chrome.runtime.getURL("/popup.html")
  console.log(url)
  chrome.tabs.create({
    url: url || "https://app.salesrobot.co/accounts?onboardingRef=extension"
  })
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "contentScriptToPopup") {
    openPopup()
    // Log the message received from the content script
    console.log("Message from content script:", message.command, message.data)

    // Send the message to the popup
    setTimeout(() => {
      chrome.runtime.sendMessage({
        action: "backgroundToPopup",
        data: message.data,
        command: message.command
      }),
        5000
    })
  }
})

chrome.runtime.onInstalled.addListener(function (details) {
  // open onboarding page
  console.log("Zentigra Installed ", details)
  if (details.reason === "install") {
    chrome.tabs.create({
      url: "https://app.salesrobot.co/accounts?onboardingRef=extension"
    })
  } else if (details.reason === "update") {
    openPopup()

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
