import { NextRequest, NextResponse } from 'next/server'
import supabaseAdmin from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {

try {

const { email, password } = await req.json()

/* CREATE USER */
const { data, error } = await supabaseAdmin.auth.admin.createUser({

email,
password,
email_confirm: true

})

if (error) {

return NextResponse.json({ error: error.message }, { status: 400 })

}

/* CREATE WALLET */
await supabaseAdmin
.from('wallets')
.insert({

user_id: data.user.id,
balance: 0

})

return NextResponse.json({ success: true })

}

catch {

return NextResponse.json(
{ error: "Signup failed" },
{ status: 500 }
)

}

}
