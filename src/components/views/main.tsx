import { createClient } from "@supabase/supabase-js"
import { useState } from "react"

// import { toast } from "sonner"

import { Button } from "~/components/ui/button"
import { Input } from "~components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~components/ui/tabs"

type SequencePreviewType = {
  url: string
  x: number
  y: number
}

const supabaseUrl = "https://grikvdxhowocofqnzhjf.supabase.co"
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdyaWt2ZHhob3dvY29mcW56aGpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ3ODAyODcsImV4cCI6MjAyMDM1NjI4N30.mSqt8DcjupuwSDCDRpj5LOhhWq5SUoJsE2P9cVA7CCo"

export const supabase = createClient(supabaseUrl, supabaseKey)

// popup
export function Main({ name = "Extension" }) {
  const [sequenceName, setSequenceName] = useState<string>("")
  const [sequencePreview, setSequencePreview] = useState<SequencePreviewType[]>(
    []
  )
  const [sequence, setSequence] = useState<any>(null)
  const [steps, setSteps] = useState<any>(null)

  chrome.runtime?.onMessage?.addListener(
    function (message, sender, sendResponse) {
      if (message.action === "backgroundToPopup") {
        console.log("Message from background script:", message)

        setSequencePreview(message.data)
        // TODO Do the DB call here
        // uploadSequence(message.data)
      }
    }
  )

  const uploadSequence = async (imagesData) => {
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
        name:
          sequenceName || "test sequence " + Math.floor(Math.random() * 100),
        description: "some description",
        created_by: "prashantamoli2621@gmail.com"
      })
      .select()

    if (sequenceError) {
      console.log(sequenceError)
    }

    console.log("sequences", sequenceData)
    setSequence(sequenceData[0])

    // toast.success("Sequence created successfully")

    const sequenceId = sequenceData[0].id

    // setSequencePreview(imagesData)

    const steps = imagesData.map((image, index) => {
      return {
        sequence_id: sequenceId,
        title: "step " + index,
        description: "some description",
        image: image.url,
        x: image.x,
        y: image.y,
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

    // toast.success("Steps uploaded successfully")
  }

  const changeState = (newState) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      console.log("inside the tab function")
      const activeTabId = tabs[0].id
      chrome.tabs.sendMessage(activeTabId, { action: newState })
    })

    const delay = newState === "start" ? 1000 : 4000

    setTimeout(() => window.close(), delay)
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full gap-1 p-2">
        <Button onClick={() => changeState("start")}>Start</Button>
        <Button onClick={() => changeState("stop")}>Stop</Button>

        {/* <pre className="w-full break-words">
          {JSON.stringify(sequencePreview)}
        </pre> */}
        {/* <pre className="w-full break-words">{JSON.stringify(sequence)}</pre> */}
        {/* <pre className="w-full break-words">{JSON.stringify(steps)}</pre> */}

        {sequencePreview.length === 0 ? null : (
          <>
            <div className="absolute inset-x-0 top-0 bottom-0 z-30 flex flex-col items-center justify-center w-full h-screen gap-8 p-2 pt-24 mx-auto overflow-x-hidden overflow-y-scroll backdrop-blur">
              <Tabs defaultValue="options" className="w-full min-h-screen">
                <TabsList className="">
                  <TabsTrigger value="options">Options</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>

                <TabsContent value="options">
                  <div className="flex flex-col items-center w-full max-w-3xl gap-5 mx-auto">
                    <h2 className="absolute top-0 z-40 w-full p-2 text-2xl font-semibold">
                      Sequence Options
                    </h2>

                    <Input
                      value={sequenceName}
                      onChange={(e) => setSequenceName(e.target.value)}
                      placeholder="Enter sequence name"
                      className="max-w-sm py-2"
                    />
                    <Button
                      onClick={() => uploadSequence(sequencePreview)}
                      disabled={sequencePreview?.length ? false : true}
                      className="mx-auto mb-10">
                      Upload Sequence
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="preview">
                  <h2 className="absolute top-0 z-40 w-full p-2 text-2xl font-semibold">
                    Sequence Preview
                  </h2>

                  {sequencePreview?.map((image, key) => {
                    return (
                      <div className="relative max-w-3xl p-2 mx-auto shadow rounded-xl">
                        <img
                          src={image.url}
                          key={key}
                          className="object-contain w-full max-w-3xl shadow-xl rounded-xl"
                        />
                        <div className="flex flex-row justify-center gap-4 text-lg font-semibold">
                          <span>Step: {key + 1}</span>
                          <span className="font-semibold">x: {image.x}</span>
                          <span className="font-semibold">y: {image.y}</span>
                        </div>
                      </div>
                    )
                  })}
                </TabsContent>
              </Tabs>
            </div>
          </>
        )}
      </div>
    </>
  )
}
