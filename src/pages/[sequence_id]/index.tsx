import { formatDistanceToNowStrict } from "date-fns"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { Button } from "~components/ui/button"
import { Separator } from "~components/ui/separator"
import { supabase } from "~supabase"

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

      <div className="flex flex-col justify-between w-11/12 gap-2 p-2 mx-auto mt-3 sm:items-end sm:flex-row md:px-5">
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

      <Separator className="w-11/12 mx-auto mb-6 " />

      <div className="flex flex-col max-w-3xl p-2 mx-auto gap-9">
        {steps &&
          steps.map((step: any, key) => {
            return (
              <div
                key={key}
                id={step.position}
                className="p-2.5 border shadow-xl rounded-xl hover:shadow-2xl dark-shadow">
                <div className="flex justify-between gap-3 p-1 mb-2">
                  <div className="flex items-center justify-center w-12 text-lg font-bold transition-all border-4 border-double rounded-full shadow-lg dark-shadow hover:border-dashed h-11 bg-accent dark:bg-slate-950 hover:shadow-xl hover:scale-105">
                    {step.position}
                  </div>

                  <div className="w-full">
                    <h2 className="text-lg font-semibold ">{step.title}</h2>

                    <p className="text-sm text-secondary-foreground">
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
            )
          })}
      </div>

      <div className="w-full h-10"></div>
    </>
  )
}

export default StepsPage
