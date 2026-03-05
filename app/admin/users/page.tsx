"use client";

import { useEffect, useMemo, useState } from "react";
import UserForm from "@/components/UserForm";
import type { LORUserRow, TemplateRow } from "@/types/db";

export default function UsersPage() {
  const [users, setUsers] = useState<LORUserRow[]>([]);
  const [templates, setTemplates] = useState<TemplateRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function loadAll() {
    setError(null);

    const [userRes, templateRes] = await Promise.all([
      fetch("/api/admin/users", { cache: "no-store" }),
      fetch("/api/admin/templates", { cache: "no-store" })
    ]);

    if (!userRes.ok || !templateRes.ok) {
      setError("Failed to load admin data");
      return;
    }

    const [userData, templateData] = await Promise.all([userRes.json(), templateRes.json()]);
    setUsers(userData);
    setTemplates(templateData);
  }

  useEffect(() => {
    void loadAll();
  }, []);

  const templateMap = useMemo(() => {
    return new Map(templates.map((template) => [template.id, template.name]));
  }, [templates]);

  async function createUser(payload: {
    name: string;
    email: string;
    role: string;
    tenure: string;
    template_id: string;
  }) {
    setError(null);
    setSuccess(null);

    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({ error: "Unknown error" }));
      setError(body.error || "Failed to create user");
      return;
    }

    setSuccess("User created successfully");
    await loadAll();
  }

  return (
    <div className="grid two">
      <UserForm
        templates={templates.map((template) => ({ id: template.id, name: template.name }))}
        onSubmit={createUser}
      />

      <section className="card">
        <h3 className="panel-title">Users</h3>
        {error ? <p className="error">{error}</p> : null}
        {success ? <p className="success">{success}</p> : null}

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Template</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{templateMap.get(user.template_id) || user.template_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}