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

      // renderZentigraIFrame()

      setTimeout(() => {
        // const zentigraIframe = document.getElementById(
        //   "zentigra-iframe"
        // ) as HTMLIFrameElement
        // zentigraIframe.contentWindow.postMessage(
        //   {
        //     action: "contentScriptToPreview",
        //     command: "stop",
        //     data: sequenceData
        //   },
        //   "*"
        // )

        window.postMessage(
          {
            action: "contentScriptToPreview",
            command: "stop",
            data: [...sequenceData]
          },
          "*"
        )
      }, 20000)

      // open the preview page in a new tab
      // window
      //   .open(
      //     "http://localhost:1947/preview",
      //     "_blank",
      //     "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400"
      //   )
      //   .focus()

      // send to background
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

const captureScreen = () => {
  const ss = htmlScreenCaptureJs.capture(
    htmlScreenCaptureJs.OutputType.STRING,
    document
  )

  console.log("ss: ", `data:text/html;charset=utf-8,${encodeURI(`${ss}`)}`)
}

document.addEventListener("mousedown", function (event) {
  const x = event.clientX
  const y = event.clientY
  console.log("Mouse clicked at:", { x: event.clientX, y: event.clientY })

  // captureScreen()

  // TODO: send sample data to the preview page
  if (window.location.href.includes("localhost:1947")) {
    window.postMessage(
      {
        action: "contentScriptToPreview",
        command: "stop",
        data: { x, y }
      },
      `*`
    )
  }

  if (currentState !== "start") {
    return
  }

  const screenshotTarget = document.body

  htmlToImage
    .toCanvas(screenshotTarget, {
      width: window.innerWidth,
      height: window.innerHeight,
      canvasWidth: window.innerWidth,
      canvasHeight: window.innerHeight
    })
    .then(function (canvas) {
      // document.body.appendChild(canvas);

      const base64image = canvas.toDataURL("image/png")
      console.log("this is the image: ", base64image)

      window.postMessage(
        {
          action: "contentScriptToPreview",
          command: "stop",
          data: { url: base64image }
        },
        `${frontendUrl}/preview/`
      )

      chrome.storage.local.get(["image"]).then((result) => {
        console.log("Value currently is " + result["image"])
        let imageString = result["image"]

        console.log("this is the imageString: ", imageString)
        if (imageString == null) {
          imageString = "[]"
        }
        let imageArray = JSON.parse(imageString)
        console.log("imageArray: ", imageArray)
        imageArray.push({ url: base64image, x, y })
        imageString = JSON.stringify(imageArray)
        console.log("imageArrary after: ", imageArray.length)

        chrome.storage.local.set({ image: imageString }).then(() => {
          console.log("Value is set")
        })
      })
    })
})

const renderZentigraIFrame = () => {
  const iframe = document.createElement("iframe")
  iframe.src = frontendUrl
    ? `${frontendUrl}/preview`
    : "http://localhost:1947/preview"
  iframe.width = "100%"
  iframe.height = "100%"
  iframe.id = "zentigra-iframe"

  iframe.setAttribute(
    "allow",
    "camera; microphone; fullscreen; display-capture; autoplay; encrypted-media; picture-in-picture; "
  )
  iframe.setAttribute("allowfullscreen", "true")
  iframe.setAttribute("frameborder", "0")

  iframe.style.position = "fixed"
  iframe.style.top = "0"
  iframe.style.bottom = "0"
  iframe.style.left = "0"
  iframe.style.right = "0"
  iframe.style.zIndex = "999999"
  iframe.style.border = "none"
  iframe.style.width = "100%"
  iframe.style.height = "100vh"
  iframe.style.overflowY = "scroll"

  document.body.appendChild(iframe)
}

window.onmessage = (event) => {
  if (event.data.command === "received-sequence") {
    console.log("Next=>CS: ", event.data)
  }
}
