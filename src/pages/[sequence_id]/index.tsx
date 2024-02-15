import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { Button } from "~components/ui/button"
import { supabase } from "~supabase"

export const StepsPage = () => {
  const router = useRouter()
  const { sequence_id } = router.query

  const [steps, setSteps] = useState<any>([])

  const fetchStepsFromSequenceId = async () => {
    const { data: stepsData, error: stepsError } = await supabase
      .from("steps")
      .select(`*`)
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
      <div className="flex items-center justify-between w-full p-2 md:px-5">
        <h1 className="py-4 text-2xl font-bold text-center">Steps</h1>

        <div className="flex">
          <Button onClick={() => deleteSequence()} variant="destructive">
            Delete Sequence
          </Button>
        </div>
      </div>

      <div className="flex flex-col w-full gap-5 p-5">
        {steps &&
          steps.map((step: any, key) => {
            return (
              <div
                className="w-full max-w-4xl p-3 py-5 mx-auto shadow-xl rounded-2xl"
                key={key}>
                <Image
                  src={step.image}
                  alt={step.title}
                  width={200}
                  height={200}
                  className="w-full mb-4 rounded-xl drop-shadow-xl"
                />

                <h3 className="text-xl font-semibold">
                  {step.position}: {step.title}
                </h3>

                <p>{step.description}</p>

                <div className="flex justify-around w-full text-xs">
                  <span>X: {step.x}</span>

                  <span>Y: {step.y}</span>
                </div>
              </div>
            )
          })}
      </div>
    </>
  )
}

export default StepsPage
