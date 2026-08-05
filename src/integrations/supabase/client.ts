import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'placeholder-key'

if (supabaseUrl.includes('placeholder') || supabaseAnonKey === 'placeholder-key') {
  // Fail loudly: every request will hang/fail otherwise (e.g. admin login "Load failed").
  console.error(
    '[supabase] Missing VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY — the app is using placeholder credentials and all requests will fail.',
  )
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

