import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

export async function requireAdmin() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      error: NextResponse.json(
        {
          error: "Unauthorized",
          message: authError?.message || "No active session found"
        },
        { status: 401 }
      )
    };
  }

  const { data: admin, error: dbError } = await supabase
    .from("admins")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (dbError || !admin) {
    return {
      error: NextResponse.json(
        {
          error: "Forbidden",
          message: dbError?.message || "You do not have admin privileges"
        },
        { status: 403 }
      )
    };
  }

  return { supabase, user };
}