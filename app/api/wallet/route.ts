import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function GET() {

  const cookieStore = await cookies();

  const token = cookieStore.get("sb-access-token")?.value;

  if (!token) {
    return Response.json({ balance: 0 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ balance: 0 });
  }

  const { data } = await supabase
    .from("wallets")
    .select("balance")
    .eq("user_id", user.id)
    .single();

  return Response.json({
    balance: data?.balance ?? 0,
  });

}