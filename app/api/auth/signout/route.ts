import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

async function signoutAndRedirect(request: Request) {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/login", request.url));
}

export async function GET(request: Request) {
  return signoutAndRedirect(request);
}

export async function POST(request: Request) {
  return signoutAndRedirect(request);
}