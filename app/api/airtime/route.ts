import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { phone, network, amount } = await req.json();

    // ✅ Proper validation
    if (!phone || !network || !amount) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
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

    // ✅ Get logged in user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // ✅ Get wallet
    const { data: wallet, error: walletFetchError } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (walletFetchError || !wallet) {
      return NextResponse.json(
        { error: "Wallet not found" },
        { status: 404 }
      );
    }

    if (wallet.balance < amount) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    const newBalance = wallet.balance - amount;

    // ✅ Insert transaction FIRST
    const { error: txError } = await supabase
      .from("transactions")
      .insert({
        user_id: user.id,
        type: "airtime",
        network,
        phone,
        amount,
        status: "success",
      });

    if (txError) {
      console.log("Transaction error:", txError);
      return NextResponse.json(
        { error: txError.message },
        { status: 500 }
      );
    }

    // ✅ Deduct wallet AFTER successful transaction
    const { error: walletUpdateError } = await supabase
      .from("wallets")
      .update({ balance: newBalance })
      .eq("user_id", user.id);

    if (walletUpdateError) {
      console.log("Wallet update error:", walletUpdateError);
      return NextResponse.json(
        { error: walletUpdateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      newBalance,
    });

  } catch (error) {
    console.log("Server error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}