import Link from "next/link"
import { useEffect, useState } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "~components/ui/card"
import { supabase } from "~supabase"

export const Sequences = () => {
  const [sequences, setSequences] = useState<any>([])

  const fetchAllSequences = async () => {
    const { data: sequencesData, error: sequencesError } = await supabase
      .from("sequences")
      .select("*")

    if (sequencesError) console.log(sequencesError)

    setSequences(sequencesData.reverse())
  }

  useEffect(() => {
    fetchAllSequences()
  }, [])

  return (
    <>
      <div className="grid w-full grid-cols-1 gap-5 p-5 mx-auto max-w-7xl md:grid-cols-2 xl:grid-cols-3">
        {sequences &&
          sequences.map((sequence: any, key) => {
            return (
              <Link href={`/${sequence.id}`} key={key}>
                <Card>
                  <CardHeader>
                    <CardTitle>{sequence.name}</CardTitle>
                    <CardDescription>{sequence.description}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    <p>Content</p>
                  </CardContent>

                  <CardFooter className="text-xs">
                    Sequence Id: {sequence.id}
                  </CardFooter>
                </Card>
              </Link>
            )
          })}
      </div>

      <pre className="w-full break-before-all">{JSON.stringify(sequences)}</pre>
    </>
  )
}

export default Sequences
