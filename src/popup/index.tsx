import "~styles/globals.css"

import IFrame from "~components/views/IFrame"
import { Main } from "~components/views/main"

function IndexPopup() {
  return (
    <>
      <main className="flex flex-col items-center justify-around w-full overflow-x-hidden min-w-96 h-96">
        <h1 className="text-3xl font-bold text-center">Zentigra</h1>

        <Main />

        <IFrame />
      </main>
    </>
  )
}

export default IndexPopup
