import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {

  const { phone, network, plan } = await req.json();

  const amount = 1000; // sample price

  // save transaction

  const { error } = await supabase
    .from("transactions")
    .insert({
      type: "data",
      network,
      phone,
      amount,
      status: "success"
    });

  if (error) {
    return NextResponse.json({
      message: "Transaction failed"
    });
  }

  return NextResponse.json({
    message: "Data purchase successful"
  });

}