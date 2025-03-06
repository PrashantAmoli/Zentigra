import type { PlasmoCSConfig } from "plasmo"

// export {}

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true
}

let recordingState = "stop"

console.log("Zentigra: CS is running...")

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
    console.log("BG=>CS on Tab switch: ", message)

    if (message.data === "start") injectStopButton()
    else {
      document.getElementById("zentigra-stop-button")?.remove()
    }

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

// Function to block execution for 1 second
function delayExecution() {
  const delay = 600 // mili-seconds
  const start = Date.now()
  while (Date.now() - start < delay) {
    // Busy-wait to block execution
  }
  console.log("Delayed function execution completed.")
}

const createShutterClickEffect = (): void => {
  console.log("Shutter Effect Triggered")

  // Create a div element for the overlay effect
  const overlay = document.createElement("div")
  overlay.setAttribute("id", "capture-animation-overlay")

  // Set the styles for the overlay to cover the entire screen
  Object.assign(overlay.style, {
    position: "fixed",
    top: "0",
    left: "0",
    inset: "0",
    width: "100vw",
    height: "100vh",
    backgroundColor: "black",
    opacity: "0.05",
    zIndex: "9999", // Ensure it appears above all other elements
    pointerEvents: "none", // Prevent interaction with the overlay
    cursor: "wait",
    transition: "opacity 0.2s ease-in-out"
  })

  // Append the overlay to the body
  document.body.appendChild(overlay)

  // Trigger the animation (screen goes dark and then light)
  requestAnimationFrame(() => {
    overlay.style.opacity = "0.33" // Fade to black
    setTimeout(() => {
      overlay.style.opacity = "0" // Fade back to transparent
      setTimeout(() => {
        // Remove the overlay from the DOM after the animation is complete
        document.body.removeChild(overlay)
      }, 200) // Ensure this matches the transition duration
    }, 200) // Hold the dark screen for a short moment
  })
}

document.body.addEventListener("mousedown", (event) => {
  if (recordingState !== "start") return

  const clickedElement = event.target as HTMLElement

  if (clickedElement.id === "capture-animation-overlay") {
    console.log("Overlay clicked")
    return
  }

  createShutterClickEffect()
  injectStopButton()

  if (
    clickedElement.id === "zentigra-stop-button" ||
    clickedElement.id === "zentigra-stop-button-svg" ||
    clickedElement.id === "zentigra-stop"
  )
    return

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
      title = `Clicked ${clickedElement.tagName.toLowerCase()}: ${
        clickedElement.textContent
      }`
      break
  }

  console.log(title, description)

  const x = event.clientX / window.innerWidth
  const y = event.clientY / window.innerHeight

  chrome.runtime.sendMessage({
    action: "ADD_STEP",
    command: "add",
    data: {
      x,
      y,
      title,
      description,
      page_url: window.location.href
    }
  })

  // delayExecution()

  // htmlToImage
  //   .toCanvas(screenshotTarget, {
  //     width: window.innerWidth,
  //     height: window.innerHeight,
  //     canvasWidth: window.innerWidth,
  //     canvasHeight: window.innerHeight
  //   })
  //   .then(function (canvas) {
  //     const base64image = canvas.toDataURL("image/png")
  //     console.log("image: ", { image: base64image })

  //     chrome.storage.local.get(["image"]).then((result) => {
  //       // console.log("Value currently is " + result["image"])
  //       let imageString = result["image"]

  //       // console.log("this is the imageString: ", imageString)
  //       if (imageString == null) {
  //         imageString = "[]"
  //       }

  //       let imageArray = JSON.parse(imageString)
  //       imageArray.push({
  //         image: base64image,
  //         x,
  //         y,
  //         page_url: window.location.href,
  //         title,
  //         description
  //       })
  //       imageString = JSON.stringify(imageArray)
  //       console.log("imageArray: ", imageArray.length, imageArray)

  //       chrome.storage.local.set({ image: imageString }).then(() => {
  //         console.log("Value is set")
  //       })
  //     })
  //   })
})

const injectStopButton = () => {
  if (
    document.getElementById("zentigra-stop-button") &&
    recordingState === "start"
  )
    return
  else if (
    document.getElementById("zentigra-stop-button") &&
    recordingState === "stop"
  ) {
    document.getElementById("zentigra-stop-button")?.remove()
    return
  }

  console.log("Injecting stop button")
  const stopButton = document.createElement("button")
  stopButton.id = "zentigra-stop-button"
  stopButton.innerText = "Stop"
  stopButton.innerHTML = `
  <div id="zentigra-stop" style="position: absolute; inset: 0; background: transparent; border-radius: 50%; z-index: 9999; cursor: pointer;"></div>

  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" id="zentigra-stop-button-svg" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  <path stroke-linecap="round" stroke-linejoin="round" d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 0 1 9 14.437V9.564Z" />
  </svg>
  `
  stopButton.style.position = "fixed"
  stopButton.style.bottom = "100px"
  stopButton.style.right = "10px"
  stopButton.style.zIndex = "9998"
  stopButton.style.backgroundColor = "red"
  stopButton.style.color = "white"
  stopButton.style.padding = "6px"
  stopButton.style.border = "none"
  stopButton.style.borderRadius = "50%"
  stopButton.style.boxShadow = "0 0 10px 0px rgba(0, 0, 0, 0.1)"
  stopButton.style.cursor = "pointer"
  stopButton.style.transition = "transform 0.2s"
  stopButton.style.transform = "scale(1)"
  stopButton.style.minWidth = "24px"
  stopButton.style.minHeight = "24px"
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
      }, 1500)
    })
  }, 3000)
}
