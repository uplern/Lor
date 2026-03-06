import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const auth = await requireAdmin();
    if ("error" in auth) return auth.error;

    const { id } = await params;
    const body = await request.json();

    const payload: {
        name?: string;
        department?: string;
        tenure?: string;
        template_content?: string;
        is_active?: boolean;
    } = {};
    if (body.name !== undefined) payload.name = String(body.name).trim();
    if (body.department !== undefined) payload.department = String(body.department).trim();
    if (body.tenure !== undefined) payload.tenure = String(body.tenure).trim();
    if (body.template_content !== undefined) payload.template_content = String(body.template_content).trim();
    if (body.is_active !== undefined) payload.is_active = !!body.is_active;

    if (Object.keys(payload).length === 0) {
        return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const { data, error } = await auth.supabase
        .from("templates")
        .update(payload)
        .eq("id", id)
        .select("*")
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const auth = await requireAdmin();
    if ("error" in auth) return auth.error;

    const { id } = await params;

    const { error } = await auth.supabase.from("templates").delete().eq("id", id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
