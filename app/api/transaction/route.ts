import supabaseAdmin from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/admin-auth'

export async function GET() {
  try {
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
    return Response.json(
      { error: err.message },
      { status: 401 }
    )
  }
}
