import "~styles/globals.css"

import { useEffect, useRef, useState } from "react"

import { Separator } from "~components/ui/separator"
import { Main } from "~components/views/main"

type AuthData = {
  isSignedIn: boolean
}

function IndexPopup() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [authData, setAuthData] = useState<null | AuthData>(null)

  const frontendURL =
    process.env.PLASMO_PUBLIC_FRONTEND_URL || "http://localhost:1947"

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
      <main className="flex flex-col items-center justify-between w-full py-4 overflow-x-hidden min-w-96 h-96">
        <div className="w-full">
          <h1 className="text-3xl font-bold text-center">Zentigra</h1>

          <Separator className="w-11/12 mx-auto my-1" />
        </div>

        {authData ? (
          <>
            {authData?.isSignedIn ? (
              <Main />
            ) : (
              <h3 className="w-full text-center animate-pulse">
                Sign in to capture
              </h3>
            )}
          </>
        ) : (
          <h3 className="w-full text-center animate-pulse">Loading...</h3>
        )}

        <div className="w-full h-20">
          <iframe
            src={`${frontendURL}/profile`}
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
                }, 1500)
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
