import supabaseAdmin from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/admin-auth'

export async function GET() {
  try {
    // 🔐 Admin guard
    await requireAdmin()

    const { data, error } = await supabaseAdmin
      .from('transactions')
      .select(`
        id,
        user_id,
        service,
        amount,
        status,
        reference,
        cost_price,
        fee,
        profit,
        created_at
      `)
      .order('created_at', { ascending: false })

    if (error) {
      return Response.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return Response.json({ data })

  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (err.message === 'FORBIDDEN') {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    return Response.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}
