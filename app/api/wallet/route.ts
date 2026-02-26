import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET() {

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
    return Response.json({ balance: 0 });
  }

  // get wallet balance
  const { data } = await supabase
    .from("wallets")
    .select("balance")
    .eq("user_id", user.id)
    .single();

  return Response.json({
    balance: data?.balance ?? 0,
  });

}