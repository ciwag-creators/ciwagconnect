import { NextResponse } from 'next/server'
import supabaseAdmin from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/admin-auth'

export async function GET() {
  try {
    // 🔐 Admin protection
    await requireAdmin()

    const { data, error } = await supabaseAdmin
      .from('transactions')
      .select(`
        id,
        user_id,
        service,
        amount,
        profit,
        status,
        created_at
        `)
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })
  } catch (err) {
    console.error('Audit logs error:', err)
    return NextResponse.json(
      { error: 'Unauthorized or server error' },
      { status: 401 }
    )
  }
}