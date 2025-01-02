import { useUser } from "@clerk/clerk-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Navigation, Pagination, Thumbs } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

import { Button } from "~/components/ui/button"
import { Input } from "~components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~components/ui/tabs"
import { Textarea } from "~components/ui/textarea"
import { supabase } from "~supabase"

// Import Swiper styles
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"

type SequenceType = {
  x: number
  y: number
  image: string
  title: string
  page_url: string
  description: string
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
      created_by: userEmailAddress,
      steps: sequencePreview?.length
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
        title: step?.title || "Step " + position,
        description: step?.description || "Some description",
        image: step.image,
        x: step.x,
        y: step.y,
        position,
        created_by: userEmailAddress,
        sequence_id: sequenceId,
        page_url: step?.page_url
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

      setTimeout(() => router.push(`/${sequenceId}`), 1000)
    }, 1000)

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
              Save
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preview">
            {sequencePreview ? (
              <div className="flex flex-col w-full max-w-4xl gap-6 mx-auto mb-10">
                <h1 className="w-full px-2 pt-4 text-xl font-semibold">
                  Preview Sequence: {sequencePreview.length} steps{" "}
                </h1>

                <div className="flex flex-col w-full p-2 mx-auto gap-9">
                  <Swiper
                    modules={[Pagination, Navigation]}
                    navigation={true}
                    grabCursor={true}
                    pagination={{
                      type: "progressbar",
                      clickable: true,
                      dynamicBullets: true
                    }}
                    // thumbs={{ swiper: thumbsSwiper }}
                    watchSlidesProgress
                    spaceBetween={10}
                    slidesPerView={1.0}
                    centeredSlides={true}
                    // centeredSlidesBounds={true}
                    onSlideChange={() => console.log("slide change")}
                    // onSwiper={setThumbsSwiper}
                    className="flex flex-col max-w-4xl p-4 mx-auto border shadow-inner rounded-xl mySwiper gap-9">
                    {sequencePreview.map((step: any, key: number) => {
                      return (
                        <SwiperSlide key={key} id={step.title} className="">
                          <div className="p-2.5 m-1 sm:m-4 border shadow-xl rounded-xl hover:shadow-2xl dark-shadow">
                            <div className="flex justify-between gap-3 p-1 mb-2">
                              <div className="flex items-center justify-center w-12 text-lg font-bold transition-all border-4 border-double rounded-full shadow-lg dark-shadow hover:border-dashed h-11 bg-accent dark:bg-slate-950 hover:shadow-xl hover:scale-105 min-w-12">
                                {key + 1}
                              </div>

                              <div className="w-full overflow-hidden">
                                <h2 className="text-lg font-semibold truncate">
                                  {step.title}
                                </h2>

                                <p className="text-sm truncate text-secondary-foreground">
                                  {step.description}
                                </p>
                              </div>

                              {step?.page_url ? (
                                <Link href={step?.page_url}>
                                  <Button
                                    className="w-full max-w-xs truncate"
                                    size="icon"
                                    variant="link">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke-width="1.5"
                                      className="w-6 h-6"
                                      stroke="currentColor">
                                      <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                                      />
                                    </svg>
                                  </Button>
                                </Link>
                              ) : (
                                <></>
                              )}
                            </div>

                            <div className="w-full">
                              <div className="relative w-full">
                                <Image
                                  src={step.image}
                                  alt={step.title}
                                  width={"500"}
                                  height={"330"}
                                  className="object-contain w-full h-full border shadow-xl rounded-xl"
                                />
                                <div
                                  className="absolute z-20 w-8 h-8 -translate-x-5 -translate-y-5 border-4 border-double rounded-full shadow-2xl hover:border-2 hover:border-dashed sm:w-12 sm:h-12 border-yellow-400/85 bg-green-400/25 animate-pulse hover:animate-none hover:scale-105"
                                  style={{
                                    top: `${step.y * 100}%`,
                                    left: `${step.x * 100}%`
                                  }}></div>
                              </div>
                            </div>
                          </div>
                        </SwiperSlide>
                      )
                    })}
                  </Swiper>
                </div>

                {/* {sequencePreview.map((step: any, key) => {
                  return (
                    <>
                      <div
                        key={key}
                        className="p-2.5 border shadow-xl rounded-xl hover:shadow-2xl dark-shadow">
                        <div className="flex justify-between gap-3 p-1 mb-2">
                          <div className="flex items-center justify-center w-12 text-lg font-bold transition-all border-4 border-double rounded-full shadow-lg dark-shadow hover:border-dashed h-11 bg-sky-200 dark:bg-slate-950 hover:shadow-xl hover:scale-105">
                            {key + 1}
                          </div>

                          <div className="w-full">
                            <h2 className="text-lg font-semibold ">
                              {step.title}
                            </h2>

                            <p className="text-sm text-secondary-foreground">
                              {step.description}
                            </p>
                          </div>

                          {step.page_url ? (
                            <Link href={step.page_url}>
                              <Button
                                className="w-full max-w-xs truncate"
                                size="icon"
                                variant="link">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke-width="1.5"
                                  className="w-6 h-6"
                                  stroke="currentColor">
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                                  />
                                </svg>
                              </Button>
                            </Link>
                          ) : (
                            <></>
                          )}
                        </div>

                        <div className="relative w-full overflow-hidden">
                          <Image
                            src={step.image}
                            alt={step.image}
                            width={"500"}
                            height={"330"}
                            className="object-contain w-full h-full border shadow-xl rounded-xl"
                          />

                          <div
                            className="absolute z-20 w-8 h-8 -translate-x-5 -translate-y-5 border-4 border-double rounded-full shadow-2xl hover:border-2 hover:border-dashed sm:w-12 sm:h-12 border-yellow-400/85 bg-green-400/25 animate-pulse hover:animate-none hover:scale-105"
                            style={{
                              top: `${step.y * 100}%`,
                              left: `${step.x * 100}%`
                            }}></div>
                        </div>
                      </div>
                    </>
                  )
                })} */}
              </div>
            ) : (
              <div className="animate-bounce">
                <h2 className="pt-20 text-xl font-semibold text-center transition-all lg:text-2xl animate-pulse">
                  Creating sequence preview...
                </h2>
              </div>
            )}

            {/* <pre className="w-full overflow-x-scroll text-xs break-words">
              {sequencePreview && JSON.stringify(sequencePreview, null, 2)}
            </pre> */}
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
