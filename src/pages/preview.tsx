import { useEffect, useState } from "react"

export default function PreviewPage() {
  const extensionIdentifier = "your-extension-identifier"
  const [sequencePreview, setSequencePreview] = useState(null)

  useEffect(() => {
    // window.addEventListener("message", (event) => {
    //   console.log("BGSW=>Next.js:", event.data)

    //   setSequencePreview(event.data)

    //   if (event.data.action === "backgroundToPreview") {
    //     setSequencePreview(event.data)
    //   }
    // })

    window.onmessage = (event) => {
      if (event.data.command === "stop") {
        console.log("BGSW=>Next.js:", event.data)
        setSequencePreview(event.data)
      }
      // Do something with the data in your Next.js application
      // For example, update the DOM or trigger a function
      // ...
    }
  }, [])

  return (
    <>
      <main>
        <h1 className="w-full px-3 py-2 text-xl font-semibold">Preview Page</h1>

        {sequencePreview ? null : (
          <h2 className="text-xl font-semibold text-center transition-all animate-pulse">
            Loading sequence preview...
          </h2>
        )}

        <pre className="w-full overflow-x-scroll text-xs break-words">
          {JSON.stringify(sequencePreview, null, 2)}
        </pre>
      </main>
    </>
  )
}
