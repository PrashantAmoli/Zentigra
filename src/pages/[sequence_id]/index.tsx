import { formatDistanceToNowStrict } from "date-fns"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Tooltip } from "react-tooltip"
// import QuickPinchZoom, { make3dTransformValue } from "react-quick-pinch-zoom"
import { toast } from "sonner"
import { Autoplay, Navigation, Pagination, Thumbs } from "swiper/modules"
import { Swiper, SwiperSlide, useSwiper } from "swiper/react"

import { Button } from "~components/ui/button"
import { Separator } from "~components/ui/separator"
import { supabase } from "~supabase"

// Import Swiper styles
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"

import introJs from "intro.js"
import { Steps } from "intro.js-react"

export const StepsPage = () => {
  const router = useRouter()
  const { sequence_id } = router.query

  const [steps, setSteps] = useState<any>([])

  const fetchStepsFromSequenceId = async () => {
    const { data: stepsData, error: stepsError } = await supabase
      .from("steps")
      .select(
        `
      *,
      sequences(name, description)
      `
      )
      .eq("sequence_id", sequence_id)

    if (stepsError) console.log(stepsError)

    setSteps(stepsData)

    setTimeout(() => {
      // introJs(".sequence").start()
    }, 1000)

    return stepsData
  }

  const deleteSequence = async () => {
    const confirmDeletion = window.confirm(
      "Are you sure you want to delete this sequence?"
    )
    if (!confirmDeletion) return

    // delete all steps from sequence
    const { error: stepsError } = await supabase
      .from("steps")
      .delete()
      .eq("sequence_id", sequence_id)

    if (stepsError) console.log(stepsError)
    else toast.success("Steps deleted")

    const { error } = await supabase
      .from("sequences")
      .delete()
      .eq("id", sequence_id)

    if (error) console.log(error)
    else toast.success("Sequence deleted")

    setTimeout(() => router.push("/"), 3000)
  }

  useEffect(() => {
    toast.promise(fetchStepsFromSequenceId(), {
      loading: "Loading steps...",
      success: "Steps loaded",
      error: "Failed to load steps"
    })

    console.log("swiper", Swiper)
  }, [sequence_id])

  return (
    <>
      <Head>
        <title>{steps?.[0]?.sequences?.name || "Sequence"} | Steps</title>
        <meta
          name="description"
          content={steps?.[0]?.sequences?.description || "Description"}
        />
      </Head>

      <div className="flex flex-col justify-between w-11/12 gap-2 px-2 mx-auto my-3 sm:items-end sm:flex-row max-w-7xl">
        <div className="w-full mx-auto sm:w-11/12">
          <h1 className="font-bold sm:text-xl">
            {steps?.[0]?.sequences?.name || "Sequence"}
          </h1>

          <p className="pl-1 text-sm text-secondary-foreground">
            {steps?.[0]?.sequences?.description || "Description"}
          </p>

          <div className="flex items-center justify-center w-full h-6 gap-2 sm:justify-end lg:justify-end break-keep">
            <p className="text-xs">
              {steps?.[0]?.created_at &&
                new Date(steps?.[0]?.created_at).toDateString()}
            </p>

            <Separator orientation="vertical" className="h-4" />

            <p className="text-xs">
              {steps?.[0]?.created_at &&
                formatDistanceToNowStrict(new Date(steps?.[0]?.created_at), {
                  addSuffix: true
                })}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-end gap-2">
            <Button
              onClick={() => {
                navigator.clipboard.writeText(window?.location?.href)
                toast.success(`Link copied to clipboard`)
              }}
              variant="outline">
              Share
            </Button>

            <Button onClick={() => deleteSequence()} variant="destructive">
              Delete
            </Button>
          </div>
        </div>
      </div>

      <Separator className="w-11/12 mx-auto mb-2 max-w-7xl" />

      <div className="flex flex-col w-full p-2 mx-auto gap-9">
        <Swiper
          modules={[Pagination, Navigation, Autoplay]}
          navigation={true}
          grabCursor={true}
          pagination={{
            type: "progressbar",
            clickable: true,
            dynamicBullets: true
          }}
          // autoplay={{
          //   delay: 3000,
          //   disableOnInteraction: true
          // }}
          // thumbs={{ swiper: thumbsSwiper }}
          watchSlidesProgress
          spaceBetween={10}
          slidesPerView={1.0}
          centeredSlides={true}
          // centeredSlidesBounds={true}
          onSlideChange={() => console.log("slide change")}
          // onSwiper={setThumbsSwiper}
          className="flex flex-col max-w-4xl p-4 mx-auto border shadow-inner sequence rounded-xl mySwiper gap-9">
          {steps &&
            steps.map((step: any, key) => {
              return (
                <SwiperSlide key={key} id={step.position} className="">
                  <div className="p-2.5 m-1 sm:m-4 border shadow-xl rounded-xl hover:shadow-2xl dark-shadow">
                    <div className="flex justify-between gap-3 p-1 mb-2">
                      <div className="flex items-center justify-center w-12 text-lg font-bold transition-all border-4 border-double rounded-full shadow-lg dark-shadow hover:border-dashed h-11 bg-accent dark:bg-slate-950 hover:shadow-xl hover:scale-105 min-w-12">
                        {step.position}
                      </div>

                      <div className="w-full overflow-hidden">
                        <h2 className="text-lg font-semibold line-clamp-2">
                          {step.title}
                        </h2>

                        <p className="text-sm line-clamp-6 text-secondary-foreground">
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

                        <ClickHighlight step={step} />
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              )
            })}
        </Swiper>
      </div>

      <div className="w-full h-10"></div>
    </>
  )
}

export function ClickHighlight({ step }) {
  const swiper = useSwiper()

  return (
    <>
      <a
        onClick={() => swiper.slideNext()}
        id={`anchor-${step.position}`}
        className="absolute z-20 w-8 h-8 duration-1000 -translate-x-5 -translate-y-5 border-4 border-double rounded-full shadow-2xl cursor-pointer hover:border-2 hover:border-dashed sm:w-12 sm:h-12 border-yellow-300/95 bg-green-400/20 animate-pulse hover:animate-none hover:scale-105"
        style={{
          top: `${step.y * 100}%`,
          left: `${step.x * 100}%`
        }}
        data-tooltip-class={"relative"}
        data-highlight-class={"relative"}
        data-position={"auto"}
        data-intro={`Click ${step.title}: ${step.description}`}
        data-step={step.position}></a>

      <Tooltip
        anchorSelect={`#anchor-${step.position}`}
        clickable
        className="rounded-lg shadow-lg shadow-yellow-500/35"
        delayHide={500}>
        <div className="h-auto max-w-xs p-1">
          <span className="font-semibold">{step.title}</span>

          <p className="overflow-auto text-sm line-clamp-3">
            {step.description}
          </p>
        </div>
      </Tooltip>
    </>
  )
}

export default StepsPage
