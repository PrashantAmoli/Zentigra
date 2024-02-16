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

      <div className="flex flex-col gap-5 p-5 " style={{margin: '10%'}}>
        {steps &&
          steps.map((step: any, key) => {
            return (
                <div style={{marginBottom:'4rem'}}>
                  <div className="relative " style={{maxWidth: '100%'}} >
                    <img
                          src={step.image}
                          alt={step.title}
                          width='100%'
                          height='100%'
                        />

                    <div className="absolute rounded-none border-2 -translate-y-5 -translate-x-5" style={{width: '44px', height: '44px', borderRadius: '44px', border: '2px solid rgb(251, 146, 60)',top: `${step.y*100}%`, left: `${step.x*100}%`, backgroundColor: 'rgba(251, 146, 60, 0.3)'}}></div>
                 </div>

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
