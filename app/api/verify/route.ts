import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabaseAdmin";
import { renderTemplate } from "@/lib/renderTemplate";

function formatToday(): string {
  return new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}

export async function POST(request: Request) {
  const supabase = createServiceRoleClient();
  const { name, email, token } = await request.json();

  let query = supabase.from("lor_users").select("*").limit(1);

  if (token) {
    query = query.eq("token", String(token).trim());
  } else {
    const cleanName = String(name || "").trim();
    const cleanEmail = String(email || "").trim().toLowerCase();

    if (!cleanName || !cleanEmail) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    query = query.ilike("name", cleanName).eq("email", cleanEmail);
  }

  const { data: user, error: userErr } = await query.maybeSingle();
  if (userErr || !user) {
    return NextResponse.json({ error: "Record not found" }, { status: 404 });
  }

  const { data: template, error: tplErr } = await supabase
    .from("templates")
    .select("id,name,department,template_content,is_active")
    .eq("id", user.template_id)
    .eq("is_active", true)
    .maybeSingle();

  if (tplErr || !template) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  const today = formatToday();

  const content = renderTemplate(template.template_content, {
    name: user.name,
    Name: user.name,
    role: user.role,
    Role: user.role,
    tenure: user.tenure,
    Tenure: user.tenure,
    date: today,
    Date: today
  });

  return NextResponse.json({
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
      tenure: user.tenure
    },
    template: {
      name: template.name,
      department: template.department
    },
    content
  });
}