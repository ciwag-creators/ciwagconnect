import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {

  const { email, amount } = await req.json();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // FIX TYPE ERROR HERE
  const { data } = await supabase.auth.admin.listUsers();

  const user = data?.users?.find(
    (u: any) => u.email === email
  );

  if (!user) {

    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );

  }

  const { data: wallet } =
    await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", user.id)
      .single();

  const newBalance =
    Number(wallet.balance) + Number(amount);

  await supabase
    .from("wallets")
    .update({
      balance: newBalance
    })
    .eq("user_id", user.id);

  return NextResponse.json({
    success: true
  });

}