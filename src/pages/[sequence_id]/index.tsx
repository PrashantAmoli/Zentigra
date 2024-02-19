import Image from "next/image"
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
    fetchStepsFromSequenceId()
  }, [sequence_id])

  return (
    <>
      <div className="flex flex-col justify-between w-full gap-4 p-2 mx-auto mt-2 sm:items-end sm:flex-row md:px-5 max-w-7xl">
        <div className="w-full">
          <h1 className="text-xl font-bold">
            {steps?.[0]?.sequences?.name || "Sequence"}
          </h1>

          <p className="pl-2 text-sm text-secondary-foreground">
            {steps?.[0]?.sequences?.description || "Description"}
          </p>
        </div>

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

      <Separator className="mx-auto mb-6 max-w-7xl" />

      <div className="flex flex-col max-w-4xl p-2 mx-auto gap-9">
        {steps &&
          steps.map((step: any, key) => {
            return (
              <div className="p-2.5 border shadow-xl rounded-xl hover:shadow-2xl">
                <div className="relative w-full mb-2">
                  <Image
                    src={step.image}
                    alt={step.title}
                    width={"500"}
                    height={"330"}
                    className="object-contain w-full h-full shadow-xl rounded-xl"
                  />

                  <div
                    className="absolute z-20 w-12 h-12 -translate-x-5 -translate-y-5 border-2 rounded-full shadow-2xl border-yellow-400/80 bg-green-400/25 "
                    style={{
                      top: `${step.y * 100}%`,
                      left: `${step.x * 100}%`
                    }}></div>
                </div>

                <div className="p-2 my-2">
                  <h3 className="text-lg font-semibold ">
                    {step.position}: {step.title}
                  </h3>

                  <p className="text-sm text-secondary-foreground">
                    {step.description}
                  </p>
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
