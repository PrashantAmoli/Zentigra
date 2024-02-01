import { createClient } from "@supabase/supabase-js"
import { useEffect, useState } from "react"

// import { supabase } from "~supabase"

import { Button } from "../ui/button"

const supabaseUrl = "https://grikvdxhowocofqnzhjf.supabase.co"
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdyaWt2ZHhob3dvY29mcW56aGpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ3ODAyODcsImV4cCI6MjAyMDM1NjI4N30.mSqt8DcjupuwSDCDRpj5LOhhWq5SUoJsE2P9cVA7CCo"

export const supabase = createClient(supabaseUrl, supabaseKey)

// popup
export function Main({ name = "Extension" }) {
  const [sequencePreview, setSequencePreview] = useState<string[]>([])
  const [sequence, setSequence] = useState<any>(null)
  const [steps, setSteps] = useState<any>(null)

  useEffect(() => {
    // chrome.runtime?.onMessage?.addListener(
    //   function (message, sender, sendResponse) {
    //     if (message.action === "backgroundToPopup") {
    //       console.log("Message from background script:", message)
    //       setSequencePreview(message.data)
    //       // Do the DB call here
    //     }
    //   }
    // )
  }, [])

  chrome.runtime?.onMessage?.addListener(
    function (message, sender, sendResponse) {
      if (message.action === "backgroundToPopup") {
        console.log("Message from background script:", message)

        // setSequencePreview(message.data)
        // Do the DB call here
        uploadSequence(message.data)
      }
    }
  )

  const uploadSequence = async (images) => {
    // create a sequence
    const { data, error } = await supabase.from("sequences").select("*")

    if (error) {
      console.log(error)
    } else {
      console.log("Sequences in DB: ", data)
    }

    // use the newly generated sequence id to upload the steps of the sequence to the steps table

    const { data: sequenceData, error: sequenceError } = await supabase
      .from("sequences")
      .insert({
        name: "test sequence " + Math.random(),
        description: "some description",
        created_by: "prashantamoli2621@gmail.com"
      })
      .select()

    if (sequenceError) {
      console.log(sequenceError)
    }

    console.log("sequences", sequenceData)
    setSequence(sequenceData[0])

    const sequenceId = sequenceData[0].id

    setSequencePreview(images)

    const steps = images.map((image, index) => {
      return {
        sequence_id: sequenceId,
        title: "step " + index,
        description: "some description",
        image: image,
        position: parseInt(index) + 1,
        created_by: "prashantamoli2621@gmail.com"
      }
    })

    const { data: stepsData, error: stepsError } = await supabase
      .from("steps")
      .insert([...steps])
      .select()

    if (stepsError) {
      console.log(stepsError)
    }

    console.log("steps", stepsData)
    setSteps(stepsData)
  }

  const changeState = (newState) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      console.log("inside the tab function")
      const activeTabId = tabs[0].id
      chrome.tabs.sendMessage(activeTabId, { action: newState })
    })
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full gap-1 p-2">
        <div id="id1">-</div>

        <Button onClick={() => changeState("start")}>Start</Button>
        <Button onClick={() => changeState("stop")}>Stop</Button>

        <pre className="w-full break-words">
          {JSON.stringify(sequencePreview)}
        </pre>
        <pre className="w-full break-words">{JSON.stringify(sequence)}</pre>
        <pre className="w-full break-words">{JSON.stringify(steps)}</pre>

        <div className="flex flex-col w-full gap-5">
          {sequencePreview.length === 0 ? null : (
            <>
              {sequencePreview?.map((image, key) => {
                return <img src={image} key={key} className="my-4 w-44" />
              })}
            </>
          )}
        </div>
      </div>

      {/* <button onClick={() => changeState("start")}>Start</button> */}
      {/* <button onClick={()=>changeState('pause')}>Pause</button> */}
      {/* <button onClick={() => changeState("stop")}>Stop</button> */}
    </>
  )
}
