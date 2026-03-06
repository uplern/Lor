import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const auth = await requireAdmin();
    if ("error" in auth) return auth.error;

    const { id } = await params;
    const body = await request.json();

    const payload: {
        name?: string;
        email?: string;
        role?: string;
        tenure?: string;
        template_id?: string;
    } = {};
    if (body.name !== undefined) payload.name = String(body.name).trim();
    if (body.email !== undefined) payload.email = String(body.email).trim().toLowerCase();
    if (body.role !== undefined) payload.role = String(body.role).trim();
    if (body.tenure !== undefined) payload.tenure = String(body.tenure).trim();
    if (body.template_id !== undefined) payload.template_id = String(body.template_id).trim();

    if (Object.keys(payload).length === 0) {
        return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const { data, error } = await auth.supabase
        .from("lor_users")
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

    const { error } = await auth.supabase.from("lor_users").delete().eq("id", id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
