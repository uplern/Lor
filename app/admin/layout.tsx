import type { ReactNode } from "react";
import AdminNav from "@/components/AdminNav";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <main className="container page">
      <AdminNav />
      {children}
    </main>
  );
}