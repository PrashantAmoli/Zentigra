import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

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

  useEffect(() => {
    fetchStepsFromSequenceId()
  }, [sequence_id])

  return (
    <>
      <h1 className="py-4 text-2xl font-bold text-center">Steps</h1>

      <div className="flex flex-col w-full gap-5 p-5">
        {steps &&
          steps.map((step: any, key) => {
            return (
              <div
                className="w-full max-w-4xl p-2 py-5 mx-auto shadow-xl rounded-2xl"
                key={key}>
                <Image
                  src={step.image}
                  alt={step.title}
                  width={200}
                  height={200}
                  className="w-full"
                />

                <h3 className="text-xl font-semibold">
                  {step.position}: {step.title}
                </h3>
                <p>{step.description}</p>
              </div>
            )
          })}
      </div>
    </>
  )
}

export default StepsPage
