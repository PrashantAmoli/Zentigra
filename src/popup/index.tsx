import "~styles/globals.css"

import { useEffect, useRef, useState } from "react"

import IFrame from "~components/views/IFrame"
import { Main } from "~components/views/main"

type AuthData = {
  isSignedIn: boolean
}

function IndexPopup() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [authData, setAuthData] = useState<null | AuthData>(null)

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
        setAuthData(event.data.data)
      }
    }
  }, [])

  return (
    <>
      <main className="flex flex-col items-center justify-around w-full overflow-x-hidden min-w-96 h-96">
        <h1 className="text-3xl font-bold text-center">Zentigra</h1>

        {authData?.isSignedIn ? (
          <Main />
        ) : (
          <h3 className="w-full text-center">Sign in to capture</h3>
        )}

        {/* <IFrame /> */}

        <div className="w-full h-20">
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
        </div>
      </main>
    </>
  )
}

export default IndexPopup
