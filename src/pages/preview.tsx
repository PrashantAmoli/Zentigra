import { useUser } from "@clerk/clerk-react"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { Button } from "~/components/ui/button"
import { Input } from "~components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~components/ui/tabs"
import { Textarea } from "~components/ui/textarea"
import { supabase } from "~supabase"

type SequenceType = {
  url: string
  x: number
  y: number
}

export default function PreviewPage() {
  const router = useRouter()

  const extensionIdentifier = "your-extension-identifier"
  const [sequencePreview, setSequencePreview] = useState<SequenceType[] | null>(
    null
  )

  const [sequenceName, setSequenceName] = useState<string>("")
  const [sequenceDescription, setSequenceDescription] = useState<string>("")

  const userData = useUser()

  useEffect(() => {
    window.onmessage = (event) => {
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

  const uploadSequence = async () => {
    if (!userData || !userData.isSignedIn) {
      toast.error("Please sign in to proceed further")
      return false
    }

    if (!sequencePreview) {
      toast.error("No sequence to upload")
      return false
    }

    if (sequenceName?.length < 5) {
      toast.error("Please enter a sequence name longer than 5 characters")
      return false
    }

    if (sequenceDescription?.length < 20) {
      toast.error(
        "Please enter a sequence description longer than 20 characters"
      )
      return false
    }

    const userEmailAddress = userData?.user?.emailAddresses[0]?.emailAddress

    if (!userEmailAddress) {
      toast.error("User email address not found")
      return false
    }

    // Send the sequence to the extension
    const sequenceData = {
      name: sequenceName,
      description: sequenceDescription,
      created_by: userEmailAddress
    }

    console.log("Sequence Data: ", sequenceData)

    const { data: sequenceResponse, error: sequenceError } = await supabase
      .from("sequences")
      .insert([sequenceData])
      .select("*")

    if (sequenceError) {
      console.log(sequenceError)
      throw new Error(sequenceError.message)
      return false
    }

    const sequenceId = sequenceResponse[0].id

    // create steps data
    const stepsData = sequencePreview.map((step, index) => {
      const position = index + 1

      return {
        title: "Step " + position,
        description: "Some description",
        image: step.url,
        x: step.x,
        y: step.y,
        position,
        created_by: userEmailAddress,
        sequence_id: sequenceId
      }
    })

    console.log("Steps Data: ", stepsData)

    const { data: stepsResponse, error: stepsError } = await supabase
      .from("steps")
      .insert([...stepsData])

    if (stepsError) {
      console.log(stepsError)
      throw new Error(stepsError.message)
      return false
    }

    setTimeout(() => {
      toast.info("Redirecting to sequence page...")

      setTimeout(() => router.push(`/${sequenceId}`), 2000)
    }, 2000)

    return true
  }

  return (
    <>
      <main className="w-full p-2">
        <Tabs className="mx-auto" defaultValue={"preview"}>
          <TabsList className="w-full mx-auto shadow">
            <TabsTrigger className="w-full" value="preview">
              Preview
            </TabsTrigger>
            <TabsTrigger className="w-full" value="options">
              Options
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preview">
            <h1 className="w-full px-3 py-2 text-xl font-semibold">
              Preview Sequence
            </h1>

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
              <div className="animate-bounce">
                <h2 className="pt-20 text-xl font-semibold text-center transition-all lg:text-2xl animate-pulse">
                  Creating sequence preview...
                </h2>
              </div>
            )}

            <pre className="w-full overflow-x-scroll text-xs break-words">
              {sequencePreview && JSON.stringify(sequencePreview, null, 2)}
            </pre>
          </TabsContent>

          <TabsContent value="options">
            <div className="flex flex-col items-center w-full max-w-3xl gap-5 mx-auto">
              <h2 className="text-xl font-semibold">Sequence Options</h2>

              <Input
                placeholder="Enter sequence name"
                className="max-w-md py-2"
                value={sequenceName}
                onChange={(e) => setSequenceName(e.target.value)}
              />

              <Textarea
                placeholder="Enter sequence description"
                className="max-w-md py-2"
                rows={4}
                value={sequenceDescription}
                onChange={(e) => setSequenceDescription(e.target.value)}
              />

              <Button
                className="mx-auto mb-10"
                disabled={
                  sequencePreview?.length &&
                  sequenceName.length &&
                  sequenceDescription.length
                    ? false
                    : true
                }
                onClick={() => {
                  toast.promise(uploadSequence, {
                    loading: "Uploading sequence...",
                    success: "Sequence uploaded successfully",
                    error: "Failed to upload sequence"
                  })
                }}>
                Upload Sequence
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </>
  )
}
