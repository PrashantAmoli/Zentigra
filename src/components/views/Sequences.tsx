import { useUser } from "@clerk/clerk-react"
import { formatDistanceToNowStrict } from "date-fns"
import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { Button } from "~components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "~components/ui/card"
import { Separator } from "~components/ui/separator"
import { supabase } from "~supabase"

export const Sequences = () => {
  const [sequences, setSequences] = useState<any>([])
  const userData = useUser()

  const fetchAllSequences = async () => {
    const userEmail = userData?.user?.emailAddresses[0]?.emailAddress

    if (!userEmail) {
      toast.error("User email not found.")
      return
    }

    const { data: sequencesData, error: sequencesError } = await supabase
      .from("sequences")
      .select("*")
      .eq("created_by", userEmail)
      .order("created_at", { ascending: true })

    if (sequencesError) console.log(sequencesError)

    setSequences(sequencesData.reverse())
  }

  const deleteSequence = async (sequence_id) => {
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
  }

  useEffect(() => {
    toast.promise(fetchAllSequences(), {
      loading: "Loading sequences",
      success: "Sequences loaded",
      error: "Failed to load sequences"
    })
  }, [])

  return (
    <>
      <div className="flex w-11/12 mx-auto max-w-7xl">
        <h2 className="text-2xl font-semibold ">Sequences</h2>
      </div>

      <Separator className="w-11/12 mx-auto my-2 max-w-7xl" />

      <div className="grid w-full grid-cols-1 gap-8 sm:gap-5 p-2.5 mx-auto my-4 max-w-7xl md:grid-cols-2 lg:grid-cols-3">
        {sequences &&
          sequences.map((sequence: any, key) => {
            return (
              <Card key={key}>
                <CardHeader>
                  <CardTitle className="truncate">{sequence.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {sequence.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  {/* <p className="text-xs">Sequence Id: {sequence.id}</p> */}
                  <p className="text-xs text-right">{sequence.created_by}</p>

                  <div className="flex justify-between">
                    <p className="text-xs">
                      {new Date(sequence.created_at).toDateString()}
                    </p>

                    <p className="text-xs text-right">
                      {formatDistanceToNowStrict(
                        new Date(sequence.created_at),
                        {
                          addSuffix: true
                        }
                      )}
                    </p>
                  </div>
                </CardContent>

                <CardFooter className="flex justify-end gap-3">
                  <Link href={`/${sequence.id}`}>
                    <Button size="xs" variant="outline">
                      View
                    </Button>
                  </Link>

                  <Button
                    size="xs"
                    onClick={() => deleteSequence(sequence.id)}
                    variant="destructive">
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
      </div>

      {/* <pre className="w-full break-before-all">{JSON.stringify(sequences)}</pre> */}
    </>
  )
}

export default Sequences
