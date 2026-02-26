import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export async function requireAdmin() {

  const cookieStore = await cookies();

  const token = cookieStore.get("sb-access-token")?.value;

  if (!token) {

    redirect("/auth/login");

  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: Bearer ${token},
        },
      },
    }
  );


  const { data: { user } } = await supabase.auth.getUser();


  if (!user) {

    redirect("/auth/login");

  }


  const { data: admin } = await supabase
    .from("admins")
    .select("*")
    .eq("user_id", user.id)
    .single();


  if (!admin) {

    redirect("/dashboard");

  }


  return admin;

}