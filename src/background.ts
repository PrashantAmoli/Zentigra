
export {}
 
console.log(
  "Live now; make now always the most precious time. Now will never come again."
)

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "contentScriptToPopup") {
    // Log the message received from the content script
    console.log("Message from content script:", message.data);

    // Send the message to the popup
    chrome.runtime.sendMessage({ action: "backgroundToPopup", data: message.data });
  }
});
