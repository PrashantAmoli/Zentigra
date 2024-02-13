import { useEffect, useRef } from "react"

export default function IFrame() {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const iframe = iframeRef.current
    if (iframe) {
      iframe.contentWindow?.postMessage(
        {
          command: "start",
          data: "Start the sequence"
        },
        "http://localhost:1947/"
      )
    }
  }, [])

  return (
    <div className="w-full h-20">
      <iframe
        src="http://localhost:1947/profile"
        title="Zentigra IFrame"
        width="100%"
        height="100%"
        frameBorder="0"
        ref={iframeRef}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen;"
        allowFullScreen></iframe>
    </div>
  )
}
