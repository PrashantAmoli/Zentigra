import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
// {
//   auth: {
//     storage,
//     autoRefreshToken: true,
//     persistSession: true,
//     detectSessionInUrl: true
//   }
// }
