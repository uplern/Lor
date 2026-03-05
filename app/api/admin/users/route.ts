import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET() {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { data, error } = await auth.supabase
    .from("lor_users")
    .select("id,name,email,role,tenure,template_id,token,created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const body = await request.json();
  const payload = {
    name: String(body.name || "").trim(),
    email: String(body.email || "").trim().toLowerCase(),
    role: String(body.role || "").trim(),
    tenure: String(body.tenure || "").trim(),
    template_id: String(body.template_id || "").trim()
  };

  if (!payload.name || !payload.email || !payload.role || !payload.tenure || !payload.template_id) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const token = crypto.randomUUID();

  const { data, error } = await auth.supabase
    .from("lor_users")
    .insert({ ...payload, token })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}