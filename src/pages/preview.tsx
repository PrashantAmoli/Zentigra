import { useEffect, useState } from "react"

export default function PreviewPage() {
  const extensionIdentifier = "your-extension-identifier"
  const [sequencePreview, setSequencePreview] = useState(null)

  useEffect(() => {
    // chrome.runtime.onMessageExternal.addListener(
    //   (message, sender, sendResponse) => {
    //     // Check if the message includes the correct identifier
    //     if (message.identifier === extensionIdentifier) {
    //       // Handle the message from the background script
    //       console.log("Message from background script to Next.js:", message)
    //       // Do something with the data in your Next.js application
    //       // For example, update the DOM or trigger a function
    //       // ...
    //     } else {
    //       console.error(
    //         "Invalid extension identifier. Ignoring the message.",
    //         message,
    //         sender,
    //         sendResponse
    //       )
    //     }
    //     setSequencePreview(message.data)
    //   }
    // )

    window.addEventListener("message", (event) => {
      console.log("BGSW=>Next.js:", event.data)

      setSequencePreview(event.data)

      if (event.data.action === "backgroundToPreview") {
        setSequencePreview(event.data)
      }
      // Do something with the data in your Next.js application
      // For example, update the DOM or trigger a function
      // ...
    })
  }, [])

  return (
    <>
      <main>
        <h1 className="w-full px-3 py-2 text-xl font-semibold">Preview Page</h1>

        <pre className="w-full overflow-x-scroll text-xs break-words">
          {JSON.stringify(sequencePreview, null, 2)}
        </pre>
      </main>
    </>
  )
}
