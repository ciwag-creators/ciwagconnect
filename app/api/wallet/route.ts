import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: Request) {

  const { amount } = await req.json();

  if (!amount) {
    return NextResponse.json(
      { error: "Amount required" },
      { status: 400 }
    );
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set() {},
        remove() {},
      },
    }
  );

  // get logged in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // get wallet
  const { data: wallet } = await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const newBalance = (wallet?.balance || 0) + amount;

  await supabase
    .from("wallets")
    .upsert({
      user_id: user.id,
      balance: newBalance,
    });

  // save transaction
  await supabase.from("transactions").insert({
    user_id: user.id,
    amount,
    type: "funding",
    status: "success",
  });

  return NextResponse.json({
    success: true,
  });

}