import { useEffect, useRef, useState } from "react"

export default function IFrame() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [authStatus, setAuthStatus] = useState<any>(null)

  useEffect(() => {
    const iframe = iframeRef.current
    if (iframe) {
      iframe.contentWindow?.postMessage(
        {
          command: "auth-status",
          data: "From iframe in popup to profile page"
        },
        "*"
      )
    }

    window.onmessage = (event) => {
      if (event.data.command === "auth-status") {
        console.log("App to popup:", event.data)
        setAuthStatus(event.data.data)
      }
    }
  }, [])

  return (
    <div className="w-full h-28">
      <iframe
        src="http://localhost:1947/profile"
        title="Zentigra IFrame"
        width="100%"
        height="100%"
        frameBorder="0"
        ref={iframeRef}
        className="w-full h-full"
        onLoad={() => {
          console.log("IFrame loaded")

          const iframe = iframeRef.current
          if (iframe)
            setTimeout(() => {
              iframe.contentWindow?.postMessage(
                {
                  command: "auth-status",
                  data: "From iframe.tsx to profile page"
                },
                "*"
              )
            }, 3000)
        }}
        // allow iframe to communicate with the parent window on different origin domain
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen;"
        allowFullScreen></iframe>

      <pre className="break-all">
        {authStatus && JSON.stringify(authStatus, null, 2)}
      </pre>
    </div>
  )
}
