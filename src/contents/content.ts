import * as htmlToImage from "html-to-image"

export {}

let recordingState = "stop"

const sendSequenceToPreview = async () => {
  console.log("Creating sequence to preview")
  let sequenceData = []

  chrome.storage.local.get(["image"]).then((result) => {
    let images = JSON.parse(result["image"])
    for (let image of images) {
      sequenceData.push(image)
    }

    console.info("sequenceData: ", sequenceData)

    // TODO: send the data to the Zentigra app
    // Open Zentigra preview page & send the sequenceData to it
    // send to background
    chrome.runtime.sendMessage({
      action: "PREVIEW_SEQUENCE",
      command: "stop",
      data: sequenceData
    })
  })

  // clear up the storage
  chrome.storage.local.remove(["image"]).then((result) => {
    console.log("Sequence data cleared from storage")
  })
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  // console.log("Recording state: ", message.action)
  recordingState = message.action

  if (recordingState === "stop") {
    sendSequenceToPreview()
  } else if (message.action === "TAB_SWITCHED") {
    // if (message.data === "stop" && message.data !== recordingState)
    //   sendSequenceToPreview()

    if (message.data !== recordingState) {
      // console.log("BG=>CS on Tab switch: ", message)

      recordingState = message.data
    }
  } else if (message.action === "backgroundToPreview") {
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

document.addEventListener("mousedown", function (event) {
  const x = event.clientX / window.innerWidth
  const y = event.clientY / window.innerHeight

  if (recordingState !== "start") return

  const clickedElement = event.target as HTMLElement
  let title = ""

  // get content of meta description from the meta tag in the head
  const metaDescription =
    document
      .querySelector("meta[name='description']")
      ?.getAttribute("content") || "No description found"

  const description = `On ${document.title} page 
  (${metaDescription}) `

  switch (clickedElement?.tagName) {
    case "BUTTON":
      title = `Clicked button: ${clickedElement.textContent}`
      break
    case "A":
      let href = clickedElement.getAttribute("href")
      if (href?.startsWith("/")) href = window.location.origin + href

      title = `Clicked link: ${clickedElement.textContent} - ${href}`
      break
    case "SELECT":
      title = `Clicked select element: ${clickedElement.textContent}`
      break
    case "IMG":
      let src = clickedElement.getAttribute("src")
      let alt = clickedElement.getAttribute("alt")

      title = `Clicked image ${alt ? alt : ""}: ${src ? src : ""}`
      break
    case "LABEL":
      title = `Clicked label: ${clickedElement.textContent}`
      break
    default:
      title = `Clicked ${clickedElement.tagName.toLowerCase()}`
      break
  }

  console.log(title, description)

  injectStopButton()

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
      console.log("image: ", { image: base64image })

      chrome.storage.local.get(["image"]).then((result) => {
        // console.log("Value currently is " + result["image"])
        let imageString = result["image"]

        // console.log("this is the imageString: ", imageString)
        if (imageString == null) {
          imageString = "[]"
        }

        let imageArray = JSON.parse(imageString)
        imageArray.push({
          image: base64image,
          x,
          y,
          page_url: window.location.href,
          title,
          description
        })
        imageString = JSON.stringify(imageArray)
        console.log("imageArray: ", imageArray.length, imageArray)

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

const injectStopButton = () => {
  if (document.getElementById("zentigra-stop-button")) return
  console.log("Injecting stop button")
  const stopButton = document.createElement("button")
  stopButton.id = "zentigra-stop-button"
  stopButton.innerText = "Stop"
  stopButton.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  <path stroke-linecap="round" stroke-linejoin="round" d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 0 1 9 14.437V9.564Z" />
</svg>
`
  stopButton.style.position = "fixed"
  stopButton.style.bottom = "100px"
  stopButton.style.right = "10px"
  stopButton.style.zIndex = "9999"
  stopButton.style.backgroundColor = "white"
  stopButton.style.padding = "6px"
  stopButton.style.border = "none"
  stopButton.style.borderRadius = "50%"
  stopButton.style.boxShadow = "0 0 10px 0px rgba(0, 0, 0, 0.1)"
  stopButton.style.cursor = "pointer"
  stopButton.style.transition = "transform 0.2s"
  stopButton.style.transform = "scale(1)"
  // scale on hover

  document.body.appendChild(stopButton)

  setTimeout(() => {
    stopButton.addEventListener("mousedown", () => {
      console.log("Recording state: ", recordingState, " Removing button")

      // send to background
      chrome.runtime.sendMessage({
        action: "RECORDING_STATE",
        command: "stop"
      })

      setTimeout(() => {
        sendSequenceToPreview()
        stopButton.remove()
      }, 2000)
    })
  }, 3000)
}
