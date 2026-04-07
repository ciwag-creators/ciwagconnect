import supabaseAdmin from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/admin-auth'

export async function GET() {
  await requireAdmin()

  const { data, error } = await supabaseAdmin
    .from('wallets')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return Response.json({ data })
}