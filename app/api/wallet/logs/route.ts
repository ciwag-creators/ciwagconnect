import supabaseAdmin from '@/lib/supabase/admin'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const user_id = searchParams.get('user_id')

    if (!user_id) {
      return Response.json(
        { error: 'user_id is required' },
        { status: 400 }
      )
    }

    const { data: logs, error } = await supabaseAdmin
      .from('wallet_logs')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Fetch wallet logs error:', error)
      return Response.json(
        { error: 'Failed to fetch wallet logs' },
        { status: 500 }
      )
    }

    return Response.json({
      success: true,
      logs
    })

  } catch (err) {
    console.error('❌ Server error:', err)
    return Response.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}