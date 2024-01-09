import { useState } from "react"

export function Main({ name = "Extension" }) {
  const [data, setData] = useState("")

  return (
    <div>
      <h1
      className="text-center">
        Welcome to your <a href="https://www.plasmo.com">Plasmo</a> {name}!
      </h1>
      
      <input onChange={(e) => setData(e.target.value)} value={data} className="border-1 border rounded shadow" />

      <a href="https://docs.plasmo.com">READ THE DOCS!</a>
    </div>
  )
}
