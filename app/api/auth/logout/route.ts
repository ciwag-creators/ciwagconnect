import { createSupabaseClient } from '@/lib/supabase/client'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = createSupabaseClient()

  // your logout logic
  const { error } = await supabase.auth.signOut()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ message: 'Logged out successfully' })
}