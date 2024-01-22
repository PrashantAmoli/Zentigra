import html2canvas from "html2canvas"

export {}

var currentState = "stop"

document.addEventListener("DOMContentLoaded", () => {
  console.info("Content script loaded")
  chrome.runtime.sendMessage({
    action: "contentScriptToPopup",
    data: "Content Script Loaded"
  })
})

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log("this will be the new state: ", message.action)
  currentState = message.action

  if (currentState == "stop") {
    let sequenceData = []

    //TEMPORARY
    chrome.storage.local.get(["image"]).then((result) => {
      let images = JSON.parse(result["image"])
      console.log("inside the render image")
      for (let image of images) {
        console.log("inside the loop")
        renderImage(image)

        sequenceData.push(image)
      }

      //send the data to the backend
      chrome.runtime.sendMessage({
        action: "contentScriptToPopup",
        command: "stop",
        data: sequenceData
      })
    })

    // clear up the storage
    chrome.storage.local.remove(["image"]).then((result) => {
      console.log("cleaned the image")
    })
  }
})

//TEMPORARY
const renderImage = (src) => {
  const imgElement = document.createElement("img")
  imgElement.src = src
  imgElement.alt = "Description of the image"
  imgElement.width = 800
  document.body.appendChild(imgElement)
}

document.addEventListener("mousedown", function (event) {
  console.log("Mouse clicked at:", { x: event.clientX, y: event.clientY })

  if (currentState !== "start") {
    return
  }

  const screenshotTarget = document.body

  html2canvas(screenshotTarget, {
    x: window.scrollX,
    y: window.scrollY,
    width: window.innerWidth,
    height: window.innerHeight
  }).then(async (canvas) => {
    console.log("screenshot taken")
    const base64image = canvas.toDataURL("image/png")
    console.log("this is the image: ", base64image)

    chrome.storage.local.get(["image"]).then((result) => {
      console.log("Value currently is " + result["image"])
      let imageString = result["image"]

      console.log("this is the imageString: ", imageString)
      if (imageString == null) {
        imageString = "[]"
      }
      let imageArray = JSON.parse(imageString)
      console.log("imageArray: ", imageArray)
      imageArray.push(base64image)
      imageString = JSON.stringify(imageArray)
      console.log("imageArrary after: ", imageArray.length)

      chrome.storage.local.set({ image: imageString }).then(() => {
        console.log("Value is set")
      })
    })
  })
})
