import { supabase } from "~supabase"
import { Main } from "~components/main"
import { useEffect, useState } from "react"

function IndexPage() {
  const [users, setUsers] = useState<unknown>([]) // <-- add this line

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from('users').select('*')
      setUsers(data)
    }
    fetchUsers()
  }, [])

  return (
    <>
      <Main name="App" />
      <pre>{JSON.stringify(users, null, 2)}</pre>
    </>
  )
}

export default IndexPage
