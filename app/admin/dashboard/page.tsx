import { createServerSupabaseClient } from "@/lib/supabaseServer";

export default async function AdminDashboardPage() {
  const supabase = await createServerSupabaseClient();

  const [{ count: templateCount }, { count: userCount }] = await Promise.all([
    supabase.from("templates").select("id", { count: "exact", head: true }),
    supabase.from("lor_users").select("id", { count: "exact", head: true })
  ]);

  return (
    <section className="grid two">
      <article className="card kpi">
        <p className="kpi-label">Total Templates</p>
        <p className="kpi-value">{templateCount ?? 0}</p>
      </article>
      <article className="card kpi">
        <p className="kpi-label">Total User Records</p>
        <p className="kpi-value">{userCount ?? 0}</p>
      </article>
    </section>
  );
}