import Image from "next/image"
import { useEffect, useState } from "react"

type SequenceType = {
  url: string
  x: number
  y: number
}

export default function PreviewPage() {
  const extensionIdentifier = "your-extension-identifier"
  const [sequencePreview, setSequencePreview] = useState<SequenceType[] | null>(
    null
  )

  useEffect(() => {
    window.onmessage = (event) => {
      console.info("Events: ", event.origin, event.data)

      if (event.data.command === "stop") {
        console.log("CS=>Next.js:", event.data)
        setSequencePreview(event.data.data)

        // Send the sequence to the extension
        window.parent.postMessage(
          {
            command: "received-sequence",
            data: "Sequence received successfully!"
          },
          "*"
        )
      }
    }
  }, [])

  return (
    <>
      <main>
        <h1 className="w-full px-3 py-2 text-xl font-semibold">Preview Page</h1>

        {sequencePreview ? (
          <div className="flex flex-col w-full max-w-3xl gap-5 mx-auto">
            <h2 className="text-xl">{sequencePreview.length} Steps: </h2>

            {sequencePreview.map((step, index) => (
              <Image
                key={index}
                src={step.url}
                width={300}
                height={220}
                alt={step.url}
                className="w-full shadow-xl rounded-xl "
              />
            ))}
          </div>
        ) : (
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
