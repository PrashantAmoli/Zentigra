import * as htmlScreenCaptureJs from "html-screen-capture-js"
import * as htmlToImage from "html-to-image"

const frontendUrl = "http://localhost:1947"

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
  console.log("New state: ", message.action)
  currentState = message.action

  if (currentState == "stop") {
    let sequenceData = []

    //TEMPORARY
    chrome.storage.local.get(["image"]).then((result) => {
      let images = JSON.parse(result["image"])
      console.log("inside the render image")
      for (let image of images) {
        console.log("inside the loop")
        // renderImage(image)

        sequenceData.push(image)
      }
      console.info("sequenceData: ", sequenceData)

      // TODO: send the data to the Zentigra app
      // Open Zentigra preview page & send the sequenceData to it
      // send to background
      chrome.runtime.sendMessage({
        action: "contentScriptToPreview",
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

document.addEventListener("mousedown", function (event) {
  const clickedText ='Clicked on ' + '"'+(event.srcElement as HTMLElement).innerText +'"';
  const x = event.clientX/window.innerWidth
  const y = event.clientY/window.innerHeight
  console.log("Mouse clicked at:", { x: event.clientX/window.innerWidth, y: event.clientY/window.innerHeight })

  // TODO: send sample data to the preview page
  // chrome.runtime.sendMessage({
  //   action: "contentScriptToPreview",
  //   command: "start"
  //   data: { x, y }
  // })

  if (currentState !== "start") return

  const screenshotTarget = document.body

  htmlToImage
    .toCanvas(screenshotTarget, {
      width: window.innerWidth,
      height: window.innerHeight,
      canvasWidth: window.innerWidth,
      canvasHeight: window.innerHeight
    })
    .then(function (canvas) {
      const base64image = canvas.toDataURL("image/png")
      console.log("this is the image: ", base64image)

      chrome.storage.local.get(["image"]).then((result) => {
        // console.log("Value currently is " + result["image"])
        let imageString = result["image"]

        // console.log("this is the imageString: ", imageString)
        if (imageString == null) {
          imageString = "[]"
        }

        let imageArray = JSON.parse(imageString)
        console.log("imageArray: ", imageArray)
        imageArray.push({ url: base64image, x, y, clickedText })
        imageString = JSON.stringify(imageArray)
        console.log("imageArrary after: ", imageArray.length)

        chrome.storage.local.set({ image: imageString }).then(() => {
          console.log("Value is set")
        })
      })
    })
})

// window.onmessage = (event) => {
//   console.log("onmessage in CS: ", event.data)

//   if (event.data.command === "received-sequence") {
//     console.log("Next=>CS: ", event.data)
//   }
// }

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log("Message from background: ", message)

  if (message.action === "backgroundToPreview") {
    window.postMessage(
      {
        action: "backgroundToPreview",
        command: "stop",
        data: message.data
      },
      "*"
    )
  }
})
