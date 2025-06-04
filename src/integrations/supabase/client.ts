
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = 'https://jmaqqgaxaogkhwhffqbr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptYXFxZ2F4YW9na2h3aGZmcWJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwMzQwNzAsImV4cCI6MjA2NDYxMDA3MH0.hjT5Jhj2QUrOZE2KdbgVJWz_uFgzc9yutr1pFg7H1is'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
