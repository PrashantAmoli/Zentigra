import Sequences from "~components/views/Sequences"
import Welcome from "~components/views/Welcome"

function IndexPage() {
  chrome.runtime?.onMessage?.addListener(() => {
    console.log("message received in next app index.tsx")
  })

  chrome.runtime?.onMessage?.addListener(
    function (message, sender, sendResponse) {
      console.info("message received in next app", message)
      if (message.action === "backgroundToPopup") {
        console.log("Message from background script:", message.data)

        // Do the DB call here
      }
    }
  )

  return (
    <>
      <main className="w-full min-h-screen overflow-x-hidden">
        <Welcome />

        <Sequences />
      </main>
    </>
  )
}

export default IndexPage
