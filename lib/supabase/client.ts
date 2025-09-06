import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://jxogjjqzrnhdnvoturjx.supabase.co"
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4b2dqanF6cm5oZG52b3R1cmp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNTg1MjYsImV4cCI6MjA3MjYzNDUyNn0.2gCfsrCYQi4OIDYnZOG0Qa5UjYhjyJNgcd1U9Iwni_8"

  // If environment variables are not set, return null to trigger demo mode
  if (!supabaseUrl || !supabaseAnonKey || 
      supabaseUrl === 'https://your-project-ref.supabase.co' || 
      supabaseAnonKey === 'your-anon-key-here') {
    console.log("[v0] Supabase environment variables not configured, using demo mode")
    return null
  }

  console.log("[v0] Using Supabase with URL:", supabaseUrl)
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
