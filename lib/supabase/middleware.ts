import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // If Supabase is not configured, skip authentication
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://jxogjjqzrnhdnvoturjx.supabase.co"
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4b2dqanF6cm5oZG52b3R1cmp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNTg1MjYsImV4cCI6MjA3MjYzNDUyNn0.2gCfsrCYQi4OIDYnZOG0Qa5UjYhjyJNgcd1U9Iwni_8"

  if (!supabaseUrl || !supabaseAnonKey || 
      supabaseUrl === 'https://your-project-ref.supabase.co' || 
      supabaseAnonKey === 'your-anon-key-here') {
    console.log("[Middleware] Supabase not configured, skipping authentication")
    return supabaseResponse
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Don't redirect API routes or demo page
  if (request.nextUrl.pathname !== "/" && 
      !user && 
      !request.nextUrl.pathname.startsWith("/auth") && 
      !request.nextUrl.pathname.startsWith("/api") &&
      !request.nextUrl.pathname.startsWith("/demo")) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}